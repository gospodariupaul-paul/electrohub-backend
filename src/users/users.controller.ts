import {
  Controller,
  Delete,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { Request } from "express";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteUser(@Param("id") id: string, @Req() req: Request) {
    const userId = req.user["id"];

    // 🔥 Permitem ștergerea DOAR a propriului cont
    if (userId !== Number(id)) {
      return { message: "Forbidden" };
    }

    await this.usersService.deleteUser(Number(id));

    return { message: "User deleted successfully" };
  }
}
