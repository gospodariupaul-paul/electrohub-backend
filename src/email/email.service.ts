import { Injectable } from "@nestjs/common";
import { Resend } from "resend";

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationCode(email: string, code: string) {
    await this.resend.emails.send({
      from: "ElectroHub <noreply@electrohub.ro>",
      to: email,
      subject: "Codul tău de verificare",
      html: `
        <h2>Codul tău de verificare</h2>
        <p>Codul este: <b>${code}</b></p>
        <p>Este valabil 10 minute.</p>
      `,
    });
  }
}
