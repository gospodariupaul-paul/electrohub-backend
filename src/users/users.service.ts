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

  async setUserOnline(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isOnline: true },
    });
  }

  async setUserOffline(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isOnline: false },
    });
  }

  getOnlineUsers() {
    return this.prisma.user.findMany({
      where: { isOnline: true },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        role: true,
        isOnline: true,
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

  // 🔥🔥🔥 FIX CRUCIAL — userul devine offline înainte de ștergere
  async deleteUser(id: number) {
    try {
      await this.setUserOffline(id);
    } catch (e) {
      // dacă userul nu există, ignorăm
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
