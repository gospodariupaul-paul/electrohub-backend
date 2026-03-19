import { Injectable } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class HelpService {
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

  async sendContactMessage(dto: ContactDto) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 465,
      secure: true,
      auth: {
        user: 'gospopaul2006@yahoo.com',
        pass: 're_cTQGfkKt_5HWJhuvN6H1UsXbY9dXZTWz2', // pune parola ta aici
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"ElectroHub Contact" <gospopaul2006@yahoo.com>`,
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

    return { message: 'Mesajul tău a fost trimis cu succes.' };
  }

  getPolicies() {
    return {
      terms: '/policies/terms',
      privacy: '/policies/privacy',
      return: '/policies/return',
      delivery: '/policies/delivery',
    };
  }

  getStatus() {
    return {
      server: 'online',
      issues: [],
      maintenance: null,
    };
  }
}
