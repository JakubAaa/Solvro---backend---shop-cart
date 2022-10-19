import {CartRepository} from "../repository/cart.repository";
import {DiscountCodeBody, Product, QuantityBody, ShippingBody} from "./cart.interfaces";
import codes from '../resource.i18n/discountCodes.json'

export class CartService {
    getCart = async (userId: string) =>
        CartRepository.findUserCart(userId).then(cart => this.mapCart(cart))

    addProduct = async (userId: string, product: Product) => {
        await CartRepository.addProduct(userId, product)
    }

    deleteProduct = async (userId: string, productId: string) => {
        await CartRepository.deleteProduct(userId, productId)
    }

    changeQuantity = async (userId: string, productId: string, body: QuantityBody) => {
        await CartRepository.changeQuantity(userId, productId, body.newQuantity)
    }

    changeShipping = async (userId: string, body: ShippingBody) => {
        await CartRepository.changeShipping(userId, body.shippingMethod)
    }

    setDiscountCode = async (userId: string, body: DiscountCodeBody) => {
        if (codes.filter(code => code.code === body.code).length > 0)
            await CartRepository.setDiscountCode(userId, body.code)
    }

    mapCart = cart => (
        {
            products: cart.products,
            totalValue: cart.totalValue
        }
    )
}