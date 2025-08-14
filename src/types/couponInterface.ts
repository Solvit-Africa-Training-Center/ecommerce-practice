export interface CouponAttributes {
  id: number;
  code: string;
  discount: number;
  isActive: boolean;
  expiredDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
