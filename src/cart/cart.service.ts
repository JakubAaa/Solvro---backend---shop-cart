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
import moment from "moment";

export const TWO_HOURS = 2 * 60 * 60 * 1000;
export const DEFAULT_NUMBER_OF_USES = 5;

export class CartService {
    getCart = async (userId: string) => {
        const cart = await CartRepository.findUserCart(userId)
        if (!cart)
            throw new ResourceNotFound()

        const totalValue = this.calculateTotalValue(cart.products);

        if (!cart.discountCode)
            return this.mapCart(cart, totalValue, 0, totalValue);

        const discountValue = await this.calculateDiscount(cart.discountCode, totalValue);
        if (!discountValue)
            return this.mapCart(cart, totalValue, 0, totalValue);

        const priceAfterDiscount = totalValue - discountValue;
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
        if (!this.discountCodeExist(body.code))
            throw new ResourceNotFound()
        await CartRepository.setDiscountCode(userId, body.code)
    }

    generateShareLink = async (userId: string) => {
        const sharingCartId = uuid();
        const TTL = new Date(moment.now() + TWO_HOURS);
        await CartRepository.setSharingMetadata(userId, sharingCartId, TTL, DEFAULT_NUMBER_OF_USES);
        return this.provideShareLink(sharingCartId)
    }

    importCartByLink = async (userId: string, sharingCartId: string) => {
        const cartToShare = await CartRepository.getByLink(sharingCartId);
        if (!cartToShare)
            throw new ResourceNotFound();

        await CartRepository.decrementUsages(sharingCartId);
        await CartRepository.updateCart(
            userId,
            cartToShare.products,
            cartToShare.discountCode,
            cartToShare.shippingCost
        );
    }

    private calculateTotalValue = (products: Product[]) => {
        let totalValue = 0;
        products.forEach(p => totalValue += p.quantity * p.price)
        return totalValue;
    }

    private calculateDiscount = async (code: string, totalValue: number) => {
        const discountCode = await discountCodesList.find(c => c.code === code);
        if (!discountCode)
            return 0;

        switch (discountCode.type) {
            case DiscountCodeType.AMOUNT:
                return this.calculateDiscountAMOUNT(discountCode.value);
            case DiscountCodeType.PERCENT:
                return this.calculateDiscountPERCENT(discountCode.value, totalValue);
        }
    }

    private discountCodeExist = (code: string) =>
        discountCodesList.find(c => c.code === code)

    private mapCart = (cart: Cart, totalValue: number, discountValue: number, priceAfterDiscount: number) =>
        ({
            products: cart.products,
            shippingMethod: cart.shippingCost,
            totalValue: totalValue,
            discountValue: discountValue,
            priceAfterDiscount: priceAfterDiscount > 0 ? priceAfterDiscount : 0
        })

    private provideShareLink = (sharingCartId: string) =>
        `${appConfig.URL_DOMAIN}${appConfig.PORT}${CART_PATH}${SHARE_PATH}/${sharingCartId}`

    private calculateDiscountAMOUNT = (codeValue: string) =>
        parseInt(codeValue);

    private calculateDiscountPERCENT = (codeValue: string, totalValue: number) =>
        parseInt(codeValue) * 0.01 * totalValue;
}
