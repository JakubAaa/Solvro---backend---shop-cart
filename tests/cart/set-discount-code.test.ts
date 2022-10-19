import {CART_PATH, DISCOUNT_CODE_PATH} from "../../src/cart/cart.controller";
import {Mongo} from "../../src/db/mongo";
import {appConfig} from "../../src/utils/config";
import {cart1, discountCodeBody1, insertOne} from "../tests.utils/insert.cart";
import {appMock} from "../mocks/app.mock";
import {cartController} from "../tests.utils/controllers";
import {CartRepository} from "../../src/repository/cart.repository";
import supertest from "supertest";

describe(`POST ${CART_PATH}${DISCOUNT_CODE_PATH}`, () => {
    beforeAll(async () => {
        await Mongo.connect(appConfig.MONGO_URL)
    })

    beforeEach(async () => {
        await insertOne(cart1)
    })

    afterEach(async () => {
        await Mongo.cart().drop()
    })

    afterAll(async () => {
        await Mongo.close()
    })

    it('should set discount code in cart', async () => {
        const setDiscountCodeResponse = await supertest(appMock(cartController))
            .post(`${CART_PATH}${DISCOUNT_CODE_PATH}`)
            .send(discountCodeBody1)

        const cart = await CartRepository.findOne(cart1.cartId)

        expect(setDiscountCodeResponse.status).toBe(200)

        expect(cart!.discountCode).toBe(discountCodeBody1.code)
    })

    it('should not set discount code - code does not exist', async () => {
        const setDiscountCodeResponse = await supertest(appMock(cartController))
            .post(`${CART_PATH}${DISCOUNT_CODE_PATH}`)
            .send({code: 'non-existing code'})

        const cart = await CartRepository.findOne(cart1.cartId)

        expect(setDiscountCodeResponse.status).toBe(200)

        expect(cart!.discountCode).not.toBeDefined()
    })
})