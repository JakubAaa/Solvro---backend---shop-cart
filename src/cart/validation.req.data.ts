import * as yup from 'yup';
import {ShippingMethod} from "./cart.interfaces";

export const productSchema = yup.object().shape({
    productId: yup.string().required(),
    quantity: yup.number().required(),
    price: yup.number().required()
})

export const quantityBodySchema = yup.object().shape({
    newQuantity: yup.number().required()
})

export const shippingBodySchema = yup.object().shape({
    shippingMethod: yup.mixed<ShippingMethod>().required()
})

export const discountCodeBodySchema = yup.object().shape({
    code: yup.string().required()
})
