export type JwtPayload = {
  sub: number;
  email: string;
  refreshToken?: string;
};
