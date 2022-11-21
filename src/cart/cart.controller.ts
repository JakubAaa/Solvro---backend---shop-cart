import { Controller } from '../utils/controller'
import { Response, Router } from 'express'
import { CartService } from './cart.service'
import { AuthRequest } from '../auth/auth.request'
import { DiscountCodeBody, Product, QuantityBody, ShippingBody } from './cart.interfaces'
import { discountCodeBodySchema, productSchema, quantityBodySchema, shippingBodySchema } from './validation.req.data'
import { validate } from '../utils/validator'

export const CART_PATH = '/cart'
export const PRODUCT_PATH = '/product'
export const QUANTITY_PATH = '/quantity'
export const SHIPPING_PATH = '/shipping'
export const DISCOUNT_CODE_PATH = '/discount-code'
export const SHARE_PATH = '/share'

export class CartController implements Controller {
  router = Router()

  constructor (private cartService: CartService) {
    this.router.get(`${CART_PATH}${PRODUCT_PATH}`, (req: AuthRequest, res: Response) =>
      this.getCart(req.user.id).then(cart => res.status(200).json(cart)))

    this.router.post(`${CART_PATH}${PRODUCT_PATH}`, validate(productSchema), (req: AuthRequest, res: Response) =>
      this.addProduct(req.user.id, req.body).then(() => res.sendStatus(201)))

    this.router.delete(`${CART_PATH}${PRODUCT_PATH}/:productId`, (req: AuthRequest, res: Response) =>
      this.deleteProduct(req.user.id, req.params.productId).then(() => res.sendStatus(204)))

    this.router.put(`${CART_PATH}${PRODUCT_PATH}/:productId${QUANTITY_PATH}`, validate(quantityBodySchema), (req: AuthRequest, res: Response) =>
      this.changeQuantity(req.user.id, req.params.productId, req.body).then(() => res.sendStatus(200)))

    this.router.put(`${CART_PATH}${SHIPPING_PATH}`, validate(shippingBodySchema), (req: AuthRequest, res: Response) =>
      this.changeShipping(req.user.id, req.body).then(() => res.sendStatus(200)))

    this.router.post(`${CART_PATH}${DISCOUNT_CODE_PATH}`, validate(discountCodeBodySchema), (req: AuthRequest, res: Response) =>
      this.setDiscountCode(req.user.id, req.body).then(() => res.sendStatus(200)))

    this.router.post(`${CART_PATH}${SHARE_PATH}`, (req: AuthRequest, res: Response) =>
      this.generateShareLink(req.user.id).then(link => res.status(201).json({ link })))

    this.router.post(`${CART_PATH}${SHARE_PATH}/:sharingCartId`, (req: AuthRequest, res: Response) =>
      this.importCartByLink(req.user.id, req.params.sharingCartId).then(() => res.sendStatus(201)))
  }

  getCart (userId: string) {
    return this.cartService.getCart(userId)
  }

  addProduct (userId: string, product: Product) {
    return this.cartService.addProduct(userId, product)
  }

  deleteProduct (userId: string, productId: string) {
    return this.cartService.deleteProduct(userId, productId)
  }

  changeQuantity (userId: string, productId: string, body: QuantityBody) {
    return this.cartService.changeQuantity(userId, productId, body)
  }

  changeShipping (userId: string, body: ShippingBody) {
    return this.cartService.changeShipping(userId, body)
  }

  setDiscountCode (userId: string, body: DiscountCodeBody) {
    return this.cartService.setDiscountCode(userId, body)
  }

  generateShareLink (userId: string) {
    return this.cartService.generateShareLink(userId)
  }

  importCartByLink (userId: string, sharingCartId: string) {
    return this.cartService.importCartByLink(userId, sharingCartId)
  }
}
