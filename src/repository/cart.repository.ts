import {Mongo} from "../db/mongo";
import {ProductInCart} from "../cart/cart.interfaces";

export class CartRepository {
    public static findOne = (cartId: string) =>
        Mongo.cart().findOne({cartId});

    public static addProduct = (cartId: string, product: ProductInCart) =>
        Mongo.cart().updateOne({cartId}, {$push: {products: product}})
}