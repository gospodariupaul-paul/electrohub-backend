import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CartService } from "./cart.service";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post("add")
  async addToCart(@Req() req, @Body() body: any) {
    const userId = req.user.userId;
    const { productId, quantity } = body;

    return this.cartService.addToCart(userId, productId, quantity);
  }
}
