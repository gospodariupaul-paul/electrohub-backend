import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class FanCourierClient {
  private baseUrl = "https://www.selfawb.ro/export";

  async generateAwb(payload: Record<string, any>) {
    return axios.post(
      `${this.baseUrl}/export_awb_integrat.php`,
      new URLSearchParams(payload),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
  }

  async trackAwb(payload: Record<string, any>) {
    return axios.post(
      `${this.baseUrl}/status_awb_integrat.php`,
      new URLSearchParams(payload),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
  }

  async calculateRate(payload: Record<string, any>) {
    return axios.post(
      `${this.baseUrl}/tarif.php`,
      new URLSearchParams(payload),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
  }
}
