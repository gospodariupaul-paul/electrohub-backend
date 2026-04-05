import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateDeliverySettingsDto {
  @IsOptional()
  @IsString()
  preferredCourier?: string;

  @IsOptional()
  @IsString()
  preferredMethod?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  county?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsBoolean()
  callBefore?: boolean;

  @IsOptional()
  @IsBoolean()
  noSaturday?: boolean;

  @IsOptional()
  @IsBoolean()
  cashOnDelivery?: boolean;

  @IsOptional()
  @IsString()
  easyboxId?: string;
}
