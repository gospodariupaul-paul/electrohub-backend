import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  getAddresses(userId: number) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { id: "desc" },
    });
  }

  addAddress(userId: number, data: any) {
    return this.prisma.address.create({
      data: {
        userId,
        name: data.name,
        address: data.address,
        city: data.city,
      },
    });
  }

  // 🔥 ȘTERGERE REALĂ, 100% FUNCȚIONALĂ
  deleteAddress(userId: number, id: number) {
    return this.prisma.address.delete({
      where: { id },
    });
  }

  // 🔥 EDITARE ADRESĂ
  updateAddress(userId: number, id: number, data: any) {
    return this.prisma.address.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
      },
    });
  }
}
