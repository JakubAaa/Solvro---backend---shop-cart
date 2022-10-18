import {CartRepository} from "../repository/cart.repository";
import {ProductBody, ProductInCart} from "./cart.interfaces";
import {AuthUser} from "../auth/auth.request.interface";

export class CartService {
    addProduct = async (user: AuthUser, product: ProductBody) => {
        const productToCart: ProductInCart = {
            productId: product.productId,
            quantity: product.quantity
        }
        const totalPrice = product.price * product.quantity

        await CartRepository.addProduct(user.id, productToCart, totalPrice)
    }
}