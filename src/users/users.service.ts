import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  uploadImage(file: Express.Multer.File) {
    return this.cloudinary.uploadImage(file);
  }

  create(data: any) {
    return this.prisma.user.create({ data });
  }

  // 🔥 User devine "online" → actualizăm lastSeen
  async setUserOnline(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastSeen: new Date() },
    });
  }

  // 🔥 User devine "offline" → lastSeen = acum - 10 minute
  async setUserOffline(userId: number) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: { lastSeen: new Date(Date.now() - 10 * 60 * 1000) },
      });
    } catch (e) {
      return null;
    }
  }

  // 🔥 Useri online = activi în ultimele 2 minute
  getOnlineUsers() {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    return this.prisma.user.findMany({
      where: {
        lastSeen: { gt: twoMinutesAgo },
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        role: true,
        lastSeen: true,
      },
    });
  }

  async updateUser(id: number, data: any) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        county: data.county,
        address: data.address,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        gender: data.gender,
        imageUrl: data.avatarUrl || null,
      },
    });
  }

  // 🔥 Ștergere user — îl marcăm offline înainte
  async deleteUser(id: number) {
    await this.setUserOffline(id);

    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (e) {
      return { message: "User already deleted" };
    }
  }
}
