import { Mongo } from '../db/mongo'
import { Cart, Product, ShippingMethod } from '../cart/cart.interfaces'

export class CartRepository {
  public static insertOne = (cart: Cart) =>
    Mongo.cart().insertOne(cart)

  public static findOne = (cartId: string) =>
    Mongo.cart().findOne({ cartId })

  public static findUserCart = (userId: string) =>
    Mongo.cart().findOne({ userId })

  public static addProduct = (userId: string, product: Product) =>
    Mongo.cart().updateOne({ userId }, { $push: { products: product } }).then(r => r.modifiedCount)

  public static deleteProduct = (userId: string, productId: string) =>
    Mongo.cart().updateOne({ userId }, { $pull: { products: { productId } } }).then(r => r.modifiedCount)

  public static changeQuantity = (userId: string, productId: string, newQuantity: number) =>
    Mongo.cart().updateOne({
      userId,
      'products.productId': productId
    }, { $set: { 'products.$.quantity': newQuantity } }).then(r => r.modifiedCount)

  public static changeShipping = (userId: string, shippingCost: ShippingMethod) =>
    Mongo.cart().updateOne({ userId }, { $set: { shippingCost } }).then(r => r.modifiedCount)

  public static setDiscountCode = (userId: string, code: string) =>
    Mongo.cart().updateOne({ userId }, { $set: { discountCode: code } }).then(r => r.modifiedCount)

  public static setSharingMetadata = (userId: string, sharingCartId: string, TTL: Date, numberOfUses: number) =>
    Mongo.cart().updateOne({ userId }, {
      $set: {
        sharingCartId,
        sharingLinkTTL: TTL,
        leftLinkUsages: numberOfUses
      }
    }).then(r => r.modifiedCount)

  public static getByLink = (sharingCartId: string) =>
    Mongo.cart().findOne({ sharingCartId, leftLinkUsages: { $gt: 0 }, sharingLinkTTL: { $gte: new Date(Date.now()) } })

  public static decrementUsages = (sharingCartId: string) =>
    Mongo.cart().updateOne({ sharingCartId }, { $inc: { leftLinkUsages: -1 } }).then(r => r.modifiedCount)

  public static updateCart = (userId: string, products: Product[], discountCode: string | undefined, shippingCost: ShippingMethod) =>
    Mongo.cart().updateOne({ userId }, { $set: { products, discountCode, shippingCost } }).then(r => r.modifiedCount)
}
