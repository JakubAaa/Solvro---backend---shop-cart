import {CartRepository} from "../repository/cart.repository";
import {Product, QuantityBody} from "./cart.interfaces";

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

    mapCart = cart => (
         {
            products: cart.products,
            totalValue: cart.totalValue
        }
    )
}