import {CartRepository} from "../repository/cart.repository";
import {DiscountCodeBody, Product, QuantityBody, ShippingBody, DiscountCodeType} from "./cart.interfaces";
import codes from '../resource.i18n/discountCodes.json'

export class CartService {
    getCart = async (userId: string) => {
        const cart = await CartRepository.findUserCart(userId)

        let totalValue = this.calculateTotalValue(cart!.products);
        let discountValue = await this.calculateDiscount(cart!.discountCode, totalValue);
        let priceAfterDiscount = totalValue - discountValue;

        return {
            products: cart!.products,
            shippingMethod: cart!.shippingCost,
            totalValue: totalValue,
            discountValue: discountValue,
            priceAfterDiscount: priceAfterDiscount > 0 ? priceAfterDiscount : 0
        }
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
        if (codes.filter(code => code.code === body.code).length > 0)
            await CartRepository.setDiscountCode(userId, body.code)
    }

    private calculateTotalValue = (products: Product[]) => {
        let totalValue = 0;
        products.forEach(p => totalValue += p.quantity * p.price)
        return totalValue;
    }

    private calculateDiscount = async (code: string | undefined, totalValue: number) => {
        if (code) {
            const discountCode = await codes.filter(c => c.code === code)[0]
            if (discountCode.type === DiscountCodeType.AMOUNT)
                return Number(discountCode.value);
            if (discountCode.type === DiscountCodeType.PERCENT)
                return Number(discountCode.value) * 0.01 * totalValue;
        }
        return 0;
    }
}
