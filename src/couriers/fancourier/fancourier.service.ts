import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { FanCourierClient } from "./fancourier.client";

@Injectable()
export class FanCourierService {
  constructor(
    private prisma: PrismaService,
    private fanClient: FanCourierClient
  ) {}

  async generateAwb(orderId: number, data: any) {
    const response = await this.fanClient.generateAwb(data);
    const awb = String(response.data).trim();

    return this.prisma.shipment.create({
      data: {
        orderId,
        courier: "fancourier",
        awb,
        status: "created",
      },
    });
  }

  async trackAwb(awb: string) {
    const response = await this.fanClient.trackAwb({ awb });
    return response.data;
  }

  async getShipmentsForOrder(orderId: number) {
    return this.prisma.shipment.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  }

  // ⭐ MAPARE STATUSURI FANCOURIER → STATUS INTERN
  private mapStatus(fanStatus: string): string | null {
    const map = {
      "Colet predat curierului": "shipped",
      "Colet în tranzit": "shipped",
      "Colet în livrare": "shipped",
      "Colet livrat": "delivered",
    };

    return map[fanStatus] || null;
  }

  // ⭐ PROCESARE WEBHOOK FANCOURIER
  async processWebhook(body: any) {
    const { awb, status } = body;

    const internalStatus = this.mapStatus(status);
    if (!internalStatus) return { ignored: true };

    const shipment = await this.prisma.shipment.findFirst({
      where: { awb },
    });

    if (!shipment) return { error: "Shipment not found" };

    await this.prisma.order.update({
      where: { id: shipment.orderId },
      data: { status: internalStatus },
    });

    return { success: true };
  }
}
