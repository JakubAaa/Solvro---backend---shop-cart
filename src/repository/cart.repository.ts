import {Mongo} from "../db/mongo";
import {Cart, ProductInCart} from "../cart/cart.interfaces";

export class CartRepository {
    public static insertOne = (cart: Cart) =>
        Mongo.cart().insertOne(cart)

    public static findOne = (cartId: string) =>
        Mongo.cart().findOne({cartId})

    public static findUserCart = (userId: string) =>
        Mongo.cart().findOne({userId})

    public static addProduct = (userId: string, product: ProductInCart, price: number) =>
        Mongo.cart().updateOne({userId}, {$push: {products: product}, $inc: {totalValue: price}})
}