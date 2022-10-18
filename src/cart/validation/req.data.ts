import * as yup from 'yup';

export const addProductToCartSchema = yup.object().shape({
    productId: yup.string().required(),
    quantity: yup.number().required()
})