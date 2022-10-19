import {Product, QuantityBody} from "../../src/cart/cart.interfaces";

export const productIds = {
    id1: 'product1',
    id2: 'product2'
}

export const productPrices = {
    price1: 100,
    price2: 12345.67
}

export const productQuantities = {
    quantity1: 1,
    quantity2: 14,
    quantity3: 123
}

export const product1: Product = {
    productId: productIds.id1,
    quantity: productQuantities.quantity1,
    price: productPrices.price1
}

export const product2: Product = {
    productId: productIds.id2,
    quantity: productQuantities.quantity2,
    price: productPrices.price2
}

export const newQuantityBody1 : QuantityBody = {
    newQuantity: productQuantities.quantity3
}