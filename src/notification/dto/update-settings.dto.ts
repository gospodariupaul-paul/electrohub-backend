import { IsOptional, IsBoolean } from "class-validator";

export class UpdateSettingsDto {
  @IsOptional()
  @IsBoolean()
  email_notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  push_notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  product_alerts?: boolean;

  @IsOptional()
  @IsBoolean()
  message_alerts?: boolean;

  @IsOptional()
  @IsBoolean()
  price_alerts?: boolean;
}
