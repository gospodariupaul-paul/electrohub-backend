import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  // 🔥 FUNCȚIE DE AUTO-CATEGORIZARE
  private detectCategory(title: string, description: string = "") {
    const text = `${title} ${description}`.toLowerCase();

    const categories = [
      {
        id: 1, // Telefoane
        keywords: [
          "telefon", "smartphone", "iphone", "samsung", "huawei", "xiaomi", "oppo", "realme",
          "căști telefon", "casti telefon", "handsfree", "incarcator telefon", "adaptor telefon"
        ]
      },
      {
        id: 2, // Laptopuri
        keywords: [
          "laptop", "notebook", "macbook", "lenovo", "dell", "hp", "asus", "acer",
          "ultrabook", "gaming laptop"
        ]
      },
      {
        id: 3, // Componente PC
        keywords: [
          "placa de baza", "motherboard", "procesor", "cpu", "ram", "memorie",
          "ssd", "hdd", "cooler", "ventilator", "placa video", "gpu",
          "sursa", "psu", "carcasa", "case", "router", "switch"
        ]
      },
      {
        id: 4, // Audio-Video
        keywords: [
          "tv", "televizor", "monitor", "boxe", "soundbar", "subwoofer",
          "camera video", "webcam", "microfon", "casti audio"
        ]
      },
      {
        id: 5, // Altele
        keywords: []
      },
      {
        id: 8, // Drones
        keywords: [
          "drona", "drone", "dji", "mavic", "phantom", "mini"
        ]
      }
    ];

    for (const cat of categories) {
      if (cat.keywords.some(k => text.includes(k))) {
        return cat.id;
      }
    }

    return 5; // Altele
  }

  async create(dto: any, userId: number) {

    // 🔥 AUTO-CATEGORIZARE
    const autoCategoryId = this.detectCategory(dto.name, dto.description);

    const data: any = {
      name: dto.name,
      price: dto.price,
      description: dto.description,
      images: dto.images,
      stock: dto.stock ?? 0,
      categoryId: autoCategoryId, // 🔥 CATEGORIA SETATĂ AUTOMAT
      status: dto.status ?? 'active',
      userId,
    };

    const product = await this.prisma.product.create({ data });

    // 🔥 NOTIFICARE COMPLETĂ CU LINK + IMAGINI
    await this.notificationService.createNotification(
      userId,
      `Un utilizator a publicat un anunț nou: ${product.name}`,
      `/product/${product.id}`,   // 🔥 RUTA CORECTĂ
      Array.isArray(product.images)
        ? product.images
        : product.images
        ? [product.images]
        : []
    );

    return product;
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { status: 'active' },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.product.findMany({
      where: { userId },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async search(q: string) {
    return this.prisma.product.findMany({
      where: {
        status: 'active',
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCategory(categoryId: number) {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        status: 'active',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, dto: any, userId: number, role: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produsul nu există');
    }

    if (product.userId !== userId && role !== 'admin') {
      throw new ForbiddenException('Nu poți modifica produsul altui utilizator');
    }

    const data: any = {
      name: dto.name,
      price: dto.price,
      description: dto.description,
      images: dto.images,
      status: dto.status ?? product.status,
    };

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number, role: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produsul nu există');
    }

    if (product.userId !== userId && role !== 'admin') {
      throw new ForbiddenException('Nu poți șterge produsul altui utilizator');
    }

    return this.prisma.product.update({
      where: { id },
      data: { status: 'deleted' },
    });
  }
}
