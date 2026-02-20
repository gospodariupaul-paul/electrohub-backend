import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadImage(file: Express.Multer.File) {
    return this.cloudinary.uploadImage(file);
  }

  async create(data: any) {
    return this.prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
      },
    });
  }
}
