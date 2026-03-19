import { Injectable } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';

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

  sendContactMessage(dto: ContactDto) {
    return {
      message: 'Mesajul tău a fost trimis cu succes.',
      data: dto,
    };
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
