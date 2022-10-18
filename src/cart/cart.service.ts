import {CartRepository} from "../repository/cart.repository";
import {ProductBody, ProductInCart} from "./cart.interfaces";

export class CartService {
    getCart = async (userId: string) => {
        const cart = await CartRepository.findUserCart(userId)
        return this.mapCart(cart);
    }

    addProduct = async (userId: string, product: ProductBody) => {
        const productToCart: ProductInCart = {
            productId: product.productId,
            quantity: product.quantity
        }
        const totalPrice = product.price * product.quantity
        await CartRepository.addProduct(userId, productToCart, totalPrice)
    }

    deleteProduct = async (userId: string, body: ProductBody) => {
        const valueToDecrement = body.price * body.quantity
        await CartRepository.deleteProduct(userId, body.productId, valueToDecrement)
    }

    mapCart = cart => {
        return {
            products: cart.products,
            totalValue: cart.totalValue
        }
    }
}