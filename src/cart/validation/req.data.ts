import * as yup from 'yup';

export const productSchema = yup.object().shape({
    productId: yup.string().required(),
    quantity: yup.number().required(),
    price: yup.number().required()
})

export const quantityBodySchema = yup.object().shape({
    newQuantity: yup.number().required()
})
