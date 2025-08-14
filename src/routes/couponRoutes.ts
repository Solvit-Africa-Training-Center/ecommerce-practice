import express from 'express';
import { createCoupon, validateCoupon } from '../controllers/couponController';
import { authMiddleware, checkRole } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, checkRole(['admin']), createCoupon);

router.get('/:code', authMiddleware, validateCoupon);

export default router;
