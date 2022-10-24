import {CartRepository} from "../repository/cart.repository";
import {
    DiscountCodeBody,
    Product,
    QuantityBody,
    ShippingBody,
    DiscountCodeType,
    Cart
} from "./cart.interfaces";
import discountCodesList from '../resource.i18n/discountCodes.json'
import {ResourceNotFound} from "../error/error.module";
import {v4 as uuid} from "uuid";
import {appConfig} from "../utils/config";
import {CART_PATH, SHARE_PATH} from "./cart.controller";

export const TWO_HOURS = 2 * 60 * 60 * 1000;
export const DEFAULT_NUMBER_OF_USES = 5;

export class CartService {
    getCart = async (userId: string) => {
        const cart = await CartRepository.findUserCart(userId)
        if (!cart)
            throw new ResourceNotFound()

        const totalValue = this.calculateTotalValue(cart.products);
        let discountValue = await this.calculateDiscount(cart.discountCode, totalValue);
        let priceAfterDiscount = totalValue - discountValue;

        return this.mapCart(cart, totalValue, discountValue, priceAfterDiscount)
    }

    addProduct = async (userId: string, product: Product) => {
        await CartRepository.addProduct(userId, product)
    }

    deleteProduct = async (userId: string, productId: string) => {
        await CartRepository.deleteProduct(userId, productId)
    }

    changeQuantity = async (userId: string, productId: string, body: QuantityBody) => {
        await CartRepository.changeQuantity(userId, productId, body.newQuantity)
    }

    changeShipping = async (userId: string, body: ShippingBody) => {
        await CartRepository.changeShipping(userId, body.shippingMethod)
    }

    setDiscountCode = async (userId: string, body: DiscountCodeBody) => {
        if (this.discountCodeExist(body.code))
            await CartRepository.setDiscountCode(userId, body.code)
    }

    generateShareLink = async (userId: string) => {
        const sharingCartId = uuid();
        const TTL = new Date(Date.now() + TWO_HOURS);
        await CartRepository.setCartSharingIdNumberOfUsesAndTTL(userId, sharingCartId, TTL, DEFAULT_NUMBER_OF_USES);
        return `${appConfig.URL_DOMAIN}${appConfig.PORT}${CART_PATH}${SHARE_PATH}/${sharingCartId}`
    }

    importCartByLink = async (userId: string, sharingCartId: string) => {
        const cartToShare = await CartRepository.findCartBySharingIdAndTTLAndDecrementNumberOfUses(sharingCartId);
        if (!cartToShare)
            throw new ResourceNotFound()

        if (cartToShare.userId === userId)
            return;


        await CartRepository.updateProductsAndDiscountCodeAndShippingCost(
            userId,
            cartToShare.products,
            cartToShare.discountCode,
            cartToShare.shippingCost
        )
    }

    private calculateTotalValue = (products: Product[]) => {
        let totalValue = 0;
        products.forEach(p => totalValue += p.quantity * p.price)
        return totalValue;
    }

    private calculateDiscount = async (code: string | undefined, totalValue: number) => {
        if (code) {
            const discountCode = await discountCodesList.filter(c => c.code === code)[0]
            if (discountCode.type === DiscountCodeType.AMOUNT)
                return Number(discountCode.value);
            if (discountCode.type === DiscountCodeType.PERCENT)
                return Number(discountCode.value) * 0.01 * totalValue;
        }
        return 0;
    }

    private discountCodeExist = (code: string) =>
        discountCodesList.filter(c => c.code === code).length > 0

    private mapCart = (cart: Cart, totalValue: number, discountValue: number, priceAfterDiscount: number) =>
        (
            {
                products: cart.products,
                shippingMethod: cart.shippingCost,
                totalValue: totalValue,
                discountValue: discountValue,
                priceAfterDiscount: priceAfterDiscount > 0 ? priceAfterDiscount : 0
            }
        )
}
