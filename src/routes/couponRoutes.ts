import { Router } from 'express';
import { createCoupon, validateCoupon } from '../controllers/couponController';

const router = Router();

router.post('/coupons', createCoupon);

router.get('/coupons/:code', validateCoupon);

export default router;