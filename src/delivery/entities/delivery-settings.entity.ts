import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("delivery_settings")
export class DeliverySettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ default: "sameday" })
  preferredCourier: string; // sameday | fancourier | cargus | gls | dpd | posta | easybox

  @Column({ default: "address" })
  preferredMethod: string; // address | easybox | pickup

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  number: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  county: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ default: false })
  callBefore: boolean;

  @Column({ default: false })
  noSaturday: boolean;

  @Column({ default: false })
  cashOnDelivery: boolean;

  @Column({ nullable: true })
  easyboxId: string;
}
