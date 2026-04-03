import { Controller, Post, Body, Req, UseGuards, Get } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CartService } from "./cart.service";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post("add")
  async addToCart(@Req() req, @Body() body: any) {
    console.log("=== CART ADD REQUEST ===");
    console.log("USER OBJECT:", req.user);
    console.log("BODY:", body);

    const userId = req.user.sub;
    console.log("EXTRACTED USER ID:", userId);

    const { productId, quantity } = body;

    return this.cartService.addToCart(userId, productId, quantity);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMyCart(@Req() req) {
    const userId = req.user.sub;
    console.log("=== CART GET REQUEST ===");
    console.log("USER ID:", userId);

    return this.cartService.getCartForUser(userId);
  }
}
