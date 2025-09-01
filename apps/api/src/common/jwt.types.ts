export type JwtPayload = {
  sub: string; // userId
  role: 'customer'|'carrier'|'admin';
  companyId?: string | null;
  iat?: number;
  exp?: number;
};
