import {Mongo} from "../db/mongo";
import {Cart, Product, ShippingMethod} from "../cart/cart.interfaces";

export class CartRepository {
    public static insertOne = (cart: Cart) =>
        Mongo.cart().insertOne(cart)

    public static findOne = (cartId: string) =>
        Mongo.cart().findOne({cartId})

    public static findUserCart = (userId: string) =>
        Mongo.cart().findOne({userId})

    public static addProduct = (userId: string, product: Product) =>
        Mongo.cart().updateOne({userId}, {$push: {products: product}})

    public static deleteProduct = (userId: string, productId: string) =>
        Mongo.cart().updateOne({userId}, {$pull: {products: {productId}}})

    public static changeQuantity = (userId: string, productId: string, newQuantity: number) =>
        Mongo.cart().updateOne({userId, "products.productId": productId}, {$set: {"products.$.quantity": newQuantity}})

    public static changeShipping = (userId: string, shippingCost: ShippingMethod) =>
        Mongo.cart().updateOne({userId}, {$set: {shippingCost}})

    public static setDiscountCode = (userId: string, code: string) =>
        Mongo.cart().updateOne({userId}, {$set: {discountCode: code}})
}