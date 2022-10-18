import {ProductBody, ProductInCart} from "../../src/cart/cart.interfaces";

export const productIds = {
    id1: 'product1',
    id2: 'product2'
}

export const productNames = {
    name1: 'bike',
    name2: 'car'
}

export const productPrices = {
    price1: 100,
    price2: 12345.67
}

export const productQuantities = {
    quantity1: 1,
    quantity2: 14
}

export const product1: ProductInCart = {
    productId: productIds.id1,
    quantity: productQuantities.quantity1
}

export const product2: ProductInCart = {
    productId: productIds.id2,
    quantity: productQuantities.quantity2
}

export const productBody1: ProductBody = {
    productId: product1.productId,
    quantity: productQuantities.quantity1,
    price: productPrices.price1
}

export const productBody2: ProductBody = {
    productId: product2.productId,
    quantity: productQuantities.quantity2,
    price: productPrices.price2
}