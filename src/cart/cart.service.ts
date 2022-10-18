import {CartRepository} from "../repository/cart.repository";
import {ProductBody, ProductInCart} from "./cart.interfaces";
import {AuthUser} from "../auth/auth.request";

export class CartService {
    getCart = async (userId: string) => {
        const cart = await CartRepository.findUserCart(userId)
        return this.mapCart(cart);
    }

    addProduct = async (user: AuthUser, product: ProductBody) => {
        const productToCart: ProductInCart = {
            productId: product.productId,
            quantity: product.quantity
        }
        const totalPrice = product.price * product.quantity

        await CartRepository.addProduct(user.id, productToCart, totalPrice)
    }

    mapCart = cart => {
        return {
            products: cart.products,
            totalValue: cart.totalValue
        }
    }
}