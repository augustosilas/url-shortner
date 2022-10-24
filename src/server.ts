import "reflect-metadata";
import { config } from "dotenv";
config();

import express from "express";
import crypto from "crypto";

import { PostgresDataSource } from "./infra/database/";
import { ShortnerUrl } from "./infra/database/entities/shortner-url.entity";

const app = express();
const PORT = Number(process.env.PORT);

app.use(express.json());
app.use(express.urlencoded());

PostgresDataSource.getInstance().initialize().then().catch(console.error);

app.get("/:hash", async (req, res) => {
  const { hash } = req.params;

  const instance = PostgresDataSource.getInstance();
  const shortnerUrlRepository = instance.getRepository(ShortnerUrl);

  const findedUrl = await shortnerUrlRepository.findOne({
    where: { hash },
  });

  if (!findedUrl) return res.status(404).json({ error: "not found url" });
  if (findedUrl.expiresIn < new Date()) {
    await shortnerUrlRepository.delete({ id: findedUrl.id });
    return res.status(400).json({ error: "url has expired" });
  }

  return res.redirect(findedUrl.originalUrl);
});

app.post("/shorten-url", async (req, res) => {
  try {
    const { url } = req.body;

    const instance = PostgresDataSource.getInstance();

    const shortnerUrlRepository = instance.getRepository(ShortnerUrl);

    const findedUrl = await shortnerUrlRepository.findOne({
      where: { originalUrl: url },
    });

    if (findedUrl) {
      if (new Date(findedUrl.expiresIn) > new Date()) {
        return res.status(200).json({
          shortenedUrl: `${process.env.REDIRECTOR_URL}${findedUrl.hash}`,
        });
      }

      await shortnerUrlRepository.delete({ id: findedUrl.id });
    }

    const randomResource = crypto.randomBytes(4).toString("hex");

    const date = new Date();
    const MINUTES = 5;
    const shortnerUrl = {
      hash: randomResource,
      originalUrl: url,
      expiresIn: new Date(date.setMinutes(date.getMinutes() + MINUTES)),
    };

    await shortnerUrlRepository.save(shortnerUrl);

    return res
      .status(200)
      .json({ shortenedUrl: `${process.env.REDIRECTOR_URL}${randomResource}` });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

app.listen(PORT, () => console.log(`running server on port ${PORT}`));
