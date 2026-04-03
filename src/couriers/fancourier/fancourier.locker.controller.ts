import { Controller, Get, Query } from "@nestjs/common";
import { FanCourierLockerService } from "./fancourier.locker.service";

@Controller("fancourier/locker")
export class FanCourierLockerController {
  constructor(private lockerService: FanCourierLockerService) {}

  @Get("nearest")
  async nearest(@Query("address") address: string) {
    return this.lockerService.getNearestLocker(address);
  }
}
