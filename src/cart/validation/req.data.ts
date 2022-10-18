import * as yup from 'yup';

export const productBodySchema = yup.object().shape({
    productId: yup.string().required(),
    quantity: yup.number().required(),
    price: yup.number().required()
})
