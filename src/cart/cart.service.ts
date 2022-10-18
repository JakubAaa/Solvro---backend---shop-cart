import {CartRepository} from "../repository/cart.repository";
import {ProductInCart} from "./cart.interfaces";
import {AuthUser} from "../auth/auth.request.interface";

export class CartService {
    addProduct = async (user: AuthUser, product: ProductInCart) => {
        await CartRepository.addProduct(user.cartId, product)
    }
}