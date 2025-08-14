import { Request, Response } from 'express';
import { Coupon } from '../database/models/coupons';
import { AddCouponSchema } from '../schema/userSchema';


export const createCoupon = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { code, discount, expiredDate } = req.body;
    const { error } = AddCouponSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const existingCoupon = await Coupon.findOne({ where: { code } });
    if (existingCoupon) {
      return res.status(409).json({ success: false, message: 'Coupon code already exists' });
    }

    const newCoupon = await Coupon.create({ code, discount, expiredDate, isActive: true });

    return res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: newCoupon,
    });
  } catch (err) {
    const { message, stack } = err as Error;
    return res.status(500).json({
      success: false,
      message,
      stack,
    });
  }
};

export const validateCoupon = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { code } = req.params;

    const coupon = await Coupon.findOne({ where: { code, isActive: true } });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found or inactive' });
    }

    if (new Date() > coupon.expiredDate) {
      return res.status(400).json({ success: false, message: 'Coupon expired' });
    }

    return res.json({ success: true, coupon });
  } catch (err) {
    const { message, stack } = err as Error;
    return res.status(500).json({
      success: false,
      message,
      stack,
    });
  }
};
