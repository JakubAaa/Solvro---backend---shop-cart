import {Cart} from "../../src/cart/cart.interfaces";
import {DEFAULT_USER_ID} from "../../src/auth/auth.request";
import {productInCart1, productInCart2} from "./insert.product";
import {CartRepository} from "../../src/repository/cart.repository";

export const cartIds = {
    id1: 'cart1',
    id2: 'cart2',
    id3: 'cart3'
}

export const productsInCart = {
    products1: [productInCart1, productInCart2],
    products2: [productInCart1],
    products3: []
}

export const totalValues = {
    totalValue1: 9876.123,
    totalValue2: 123,
    totalValue3: 0
}

export const cart1: Cart = {
    cartId: cartIds.id1,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products1,
    totalValue: totalValues.totalValue1
}

export const cart2: Cart = {
    cartId: cartIds.id2,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products2,
    totalValue: totalValues.totalValue2
}

export const emptyCart: Cart = {
    cartId: cartIds.id3,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products3,
    totalValue: totalValues.totalValue3
}

export const insertOne = (cart: Cart) =>
    CartRepository.insertOne(cart)

export const insertMany = async (carts: Cart[]) => {
    let i = 0;
    while (i < carts.length) {
        await CartRepository.insertOne(carts[i])
        i++;
    }
}