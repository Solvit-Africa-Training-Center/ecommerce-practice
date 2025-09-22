import joi from 'joi';
export const OrderSchema=joi.object({
    cartId:joi.string().required(),
    shippingAddress:joi.string().required(),
    paymentMethod:joi.string().valid('card','mobileMoney','banktransfer').required(),

});