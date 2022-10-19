import {CART_PATH, PRODUCT_PATH} from "../../src/cart/cart.controller";
import {Mongo} from "../../src/db/mongo";
import {appConfig} from "../../src/utils/config";
import supertest from "supertest"
import {appMock} from "../mocks/app.mock";
import {cartController} from "../tests.utils/controllers";
import {cart1, cart2, cart3, cart4, insertOne} from "../tests.utils/insert.cart";

describe(`GET ${CART_PATH}${PRODUCT_PATH}`, () => {
    beforeAll(async () => {
        await Mongo.connect(appConfig.MONGO_URL)
    })

    afterEach(async () => {
        await Mongo.cart().drop()
    })

    afterAll(async () => {
        await Mongo.close()
    })

    it('should return a cart without any discounts', async () => {
        await insertOne(cart1)

        const getCartResponse = await supertest(appMock(cartController))
            .get(`${CART_PATH}${PRODUCT_PATH}`)
            .send()

        let totalValue = 0;
        cart1.products.forEach(p => totalValue += p.price * p.quantity)

        expect(getCartResponse.status).toBe(200)

        expect(getCartResponse.body.products).toStrictEqual(cart1.products);
        expect(getCartResponse.body.shippingMethod).toBe(cart1.shippingCost);
        expect(getCartResponse.body.totalValue).toBe(totalValue);
        expect(getCartResponse.body.discountValue).toBe(0);
        expect(getCartResponse.body.priceAfterDiscount).toBe(totalValue);
    })

    it('should return a cart with discount code - percent', async () => {
        await insertOne(cart2)

        const getCartResponse = await supertest(appMock(cartController))
            .get(`${CART_PATH}${PRODUCT_PATH}`)
            .send()

        let totalValue = 0;
        cart2.products.forEach(p => totalValue += p.price * p.quantity)
        let discountValue = totalValue * 0.1

        expect(getCartResponse.status).toBe(200)

        expect(getCartResponse.body.products).toStrictEqual(cart2.products);
        expect(getCartResponse.body.shippingMethod).toBe(cart2.shippingCost);
        expect(getCartResponse.body.totalValue).toBe(totalValue);
        expect(getCartResponse.body.discountValue).toBe(discountValue);
        expect(getCartResponse.body.priceAfterDiscount).toBe(totalValue - discountValue);
    })

    it('should return a cart with discount code - amount < totalValue', async () => {
        await insertOne(cart3)

        const getCartResponse = await supertest(appMock(cartController))
            .get(`${CART_PATH}${PRODUCT_PATH}`)
            .send()

        let totalValue = 0;
        cart3.products.forEach(p => totalValue += p.price * p.quantity)
        let discountValue = 50

        expect(getCartResponse.status).toBe(200)

        expect(getCartResponse.body.products).toStrictEqual(cart3.products);
        expect(getCartResponse.body.shippingMethod).toBe(cart3.shippingCost);
        expect(getCartResponse.body.totalValue).toBe(totalValue);
        expect(getCartResponse.body.discountValue).toBe(discountValue);
        expect(getCartResponse.body.priceAfterDiscount).toBe(totalValue - discountValue);
    })

    it('should return a cart with discount code - amount > totalValue', async () => {
        await insertOne(cart4)

        const getCartResponse = await supertest(appMock(cartController))
            .get(`${CART_PATH}${PRODUCT_PATH}`)
            .send()

        let totalValue = 0;
        cart4.products.forEach(p => totalValue += p.price * p.quantity)
        let discountValue = 10000000000

        expect(getCartResponse.status).toBe(200)

        expect(getCartResponse.body.products).toStrictEqual(cart4.products);
        expect(getCartResponse.body.shippingMethod).toBe(cart4.shippingCost);
        expect(getCartResponse.body.totalValue).toBe(totalValue);
        expect(getCartResponse.body.discountValue).toBe(discountValue);
        expect(getCartResponse.body.priceAfterDiscount).toBe(0);
    })
})