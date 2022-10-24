import {Cart, DiscountCodeBody, ShippingBody, ShippingMethod} from "../../src/cart/cart.interfaces";
import {DEFAULT_USER_ID} from "../../src/auth/auth.request";
import {product1, product2, product3} from "./insert.product";
import {CartRepository} from "../../src/repository/cart.repository";
import {DIFFERENT_USER_ID} from "../mocks/app.mock";

export const cartIds = {
    id1: 'cart1',
    id2: 'cart2',
    id3: 'cart3',
    id4: 'cart4',
    id5: 'cart5',
    id6: 'cart6',
    id7: 'cart7',
    id8: 'cart8',
    id9: 'cart9'
}

export const productsInCart = {
    products1: [product1, product2],
    products2: [product1],
    products3: [product1, product2, product3],
    products4: [product1, product3],
    products5: [],
    products6: [product2]
}

export const discountCodes = {
    code1: 'code10',
    code2: 'code20',
    code3: 'code30',
    code4: 'code50',
    code5: 'code100',
    code6: 'code10000000000'
}

export const sharingCartIds = {
    id1: 'share1',
    id2: 'share2',
    id3: 'share3',
}

export const cart1: Cart = {
    cartId: cartIds.id1,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products1,
    shippingCost: ShippingMethod.COURIER
}

export const cart2: Cart = {
    cartId: cartIds.id2,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products2,
    shippingCost: ShippingMethod.CASH_ON_DELIVERY,
    discountCode: discountCodes.code1
}

export const cart3: Cart = {
    cartId: cartIds.id3,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products3,
    shippingCost: ShippingMethod.PICKUP_IN_PERSON,
    discountCode: discountCodes.code4
}

export const cart4: Cart = {
    cartId: cartIds.id3,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products3,
    shippingCost: ShippingMethod.PICKUP_IN_PERSON,
    discountCode: discountCodes.code6
}

export const emptyCart: Cart = {
    cartId: cartIds.id5,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products5,
    shippingCost: ShippingMethod.PICKUP_IN_PERSON
}

export const otherUserCart: Cart = {
    cartId: cartIds.id6,
    userId: DIFFERENT_USER_ID,
    products: productsInCart.products6,
    shippingCost: ShippingMethod.PICKUP_IN_PERSON
}

export const cartToShare: Cart = {
    cartId: cartIds.id7,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products4,
    shippingCost: ShippingMethod.PARCEL_LOCKER,
    sharingLinkPossibleNumberOfUses: 1000000,
    sharingLinkTTL: new Date(3000, 1, 1),
    sharingCartId: sharingCartIds.id1
}

export const cartWithOutOfDateTTL: Cart = {
    cartId: cartIds.id8,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products2,
    shippingCost: ShippingMethod.PARCEL_LOCKER,
    sharingLinkPossibleNumberOfUses: 1000000,
    sharingLinkTTL: new Date(1999, 1, 1),
    sharingCartId: sharingCartIds.id2
}

export const cartWithoutMoreNumberOfUses: Cart = {
    cartId: cartIds.id9,
    userId: DEFAULT_USER_ID,
    products: productsInCart.products1,
    shippingCost: ShippingMethod.PARCEL_LOCKER,
    sharingLinkPossibleNumberOfUses: 0,
    sharingLinkTTL: new Date(3000, 1, 1),
    sharingCartId: sharingCartIds.id3
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
    while(i < carts.length){
        await CartRepository.insertOne(carts[i])
        i++;
    }
}
