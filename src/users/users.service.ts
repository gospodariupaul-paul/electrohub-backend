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
}
