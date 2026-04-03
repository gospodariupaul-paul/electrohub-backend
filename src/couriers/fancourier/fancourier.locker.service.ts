import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import axios from "axios";

@Injectable()
export class FanCourierLockerService {
  async geocodeAddress(address: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;

    const res = await axios.get(url);
    if (!res.data || res.data.length === 0) return null;

    return {
      lat: parseFloat(res.data[0].lat),
      lon: parseFloat(res.data[0].lon),
    };
  }

  async findNearestLocker(lat: number, lon: number) {
    const lockers = [
      { name: "FANbox Kaufland Iași", lat: 47.1585, lon: 27.6014 },
      { name: "FANbox Palas Mall", lat: 47.1615, lon: 27.5870 },
      { name: "FANbox Podu Roș", lat: 47.1450, lon: 27.5880 },
    ];

    let nearest: { name: string; lat: number; lon: number } | null = null;
    let minDist = Infinity;

    for (const locker of lockers) {
      const dist = Math.sqrt(
        Math.pow(lat - locker.lat, 2) + Math.pow(lon - locker.lon, 2)
      );

      if (dist < minDist) {
        minDist = dist;
        nearest = locker;
      }
    }

    return nearest;
  }

  async getNearestLocker(address: string) {
    const coords = await this.geocodeAddress(address);
    if (!coords) return { error: "Adresa nu a putut fi geocodată" };

    const locker = await this.findNearestLocker(coords.lat, coords.lon);

    return {
      userLocation: {
        lat: Number(coords.lat),
        lon: Number(coords.lon),
      },
      locker: locker
        ? {
            name: locker.name,
            lat: Number(locker.lat),
            lon: Number(locker.lon),
          }
        : null,
    };
  }
}
