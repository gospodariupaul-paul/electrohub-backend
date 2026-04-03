import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CartService } from "./cart.service";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post("add")
  async addToCart(@Req() req, @Body() body: any) {
    // 🔥 LOGURI PENTRU DEBUG
    console.log("=== CART ADD REQUEST ===");
    console.log("USER OBJECT:", req.user);
    console.log("BODY:", body);

    const userId = req.user?.sub; // aici vedem dacă e undefined
    console.log("EXTRACTED USER ID:", userId);

    const { productId, quantity } = body;

    return this.cartService.addToCart(userId, productId, quantity);
  }
}
