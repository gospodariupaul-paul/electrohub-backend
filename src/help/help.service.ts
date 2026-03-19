import { Injectable } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';
import { Resend } from 'resend';

@Injectable()
export class HelpService {
  private resend = new Resend(process.env.RESEND_API_KEY);

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
    try {
      await this.resend.emails.send({
        from: 'ElectroHub <noreply@electrohub.ro>',
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
    } catch (error) {
      console.error('EROARE RESEND:', error);
      return { message: 'Eroare la trimiterea mesajului.' };
    }
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
