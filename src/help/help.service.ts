import { Injectable } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';
import { Resend } from 'resend';
import { PrismaService } from '../prisma.service';

@Injectable()
export class HelpService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  constructor(private prisma: PrismaService) {}

  // ============================
  // FAQ
  // ============================
  getFaq() {
    return [
      {
        question: 'Cum îmi creez un cont?',
        answer: 'Apasă pe „Înregistrare”, completează datele și confirmă emailul.',
      },
      {
        question: 'Nu primesc codul de verificare prin SMS.',
        answer: 'Verifică formatul +40 și încearcă din nou. Dacă persistă, contactează suportul.',
      },
      {
        question: 'Cum îmi schimb parola?',
        answer: 'Mergi la Contul meu → Securitate → Schimbă parola.',
      },
      {
        question: 'Cum urmăresc o comandă?',
        answer: 'Intră în „Comenzile mele” pentru status în timp real.',
      },
    ];
  }

  // ============================
  // FORMULAR CONTACT (EMAIL)
  // ============================
  async sendContactMessage(dto: ContactDto) {
    try {
      console.log("=== CONTACT FORM A FOST APELAT ===");

      await this.resend.emails.send({
        from: 'ElectroHub Support <onboarding@resend.dev>',
        to: 'gospopaul2006@yahoo.com',
        subject: `Mesaj nou de la ${dto.name}`,
        html: `
          <h2>Mesaj nou din formularul de contact</h2>
          <p><strong>Nume:</strong> ${dto.name}</p>
          <p><strong>Email:</strong> ${dto.email}</p>
          <p><strong>Subiect:</strong> ${dto.subject}</p>
          <p><strong>Mesaj:</strong></p>
          <p>${dto.message}</p>
        `,
      });

      console.log("=== EMAIL TRIMIS CĂTRE RESEND ===");

      return { message: 'Mesajul tău a fost trimis cu succes.' };
    } catch (error) {
      console.error('EROARE RESEND:', error);
      return { message: 'Eroare la trimiterea mesajului.' };
    }
  }

  // ============================
  // POLICIES
  // ============================
  getPolicies() {
    return {
      terms: '/policies/terms',
      privacy: '/policies/privacy',
      return: '/policies/return',
      delivery: '/policies/delivery',
    };
  }

  // ============================
  // STATUS
  // ============================
  getStatus() {
    return {
      server: 'online',
      issues: [],
      maintenance: null,
    };
  }

  // ============================
  // MESAJE INTERNE SUPORT
  // ============================

  async saveSupportMessage(userId: number, subject: string, message: string) {
    return this.prisma.supportMessage.create({
      data: {
        userId,
        subject,
        message,
      },
    });
  }

  async getSupportMessages() {
    return this.prisma.supportMessage.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }
}
