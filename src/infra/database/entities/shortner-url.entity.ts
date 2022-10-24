import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "shortner-url" })
export class ShortnerUrl {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  hash: string;

  @Column({ name: "original_url", nullable: false })
  originalUrl: string;

  @Column({ name: "expires_in", nullable: false })
  expiresIn: Date;
}
