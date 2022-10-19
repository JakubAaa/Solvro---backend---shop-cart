import {Cart, DiscountCodeBody, ShippingBody, ShippingMethod} from "../../src/cart/cart.interfaces";
import {DEFAULT_USER_ID} from "../../src/auth/auth.request";
import {product1, product2} from "./insert.product";
import {CartRepository} from "../../src/repository/cart.repository";

export const cartIds = {
    id1: 'cart1',
    id2: 'cart2',
    id3: 'cart3'
}

export const productsInCart = {
    products1: [product1, product2],
    products2: [product1],
    products3: []
}

export const cart1: Cart = {
    cartId: cartIds.id1,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products1,
    shippingMethod: ShippingMethod.COURIER
}

export const cart2: Cart = {
    cartId: cartIds.id2,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products2,
    shippingMethod: ShippingMethod.CASH_ON_DELIVERY
}

export const emptyCart: Cart = {
    cartId: cartIds.id3,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products3,
    shippingMethod: ShippingMethod.PICKUP_IN_PERSON
}

export const newShippingBody1: ShippingBody = {
    shippingMethod: ShippingMethod.PARCEL_LOCKER
}

export const discountCodeBody1: DiscountCodeBody = {
    code: 'code10'
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