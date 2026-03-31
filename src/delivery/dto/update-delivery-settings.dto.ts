export class UpdateDeliverySettingsDto {
  preferredCourier?: string;
  preferredMethod?: string;
  street?: string;
  number?: string;
  city?: string;
  county?: string;
  postalCode?: string;
  callBefore?: boolean;
  noSaturday?: boolean;
  cashOnDelivery?: boolean;
  easyboxId?: string;
}
