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
}
