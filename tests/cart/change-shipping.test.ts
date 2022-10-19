import {CART_PATH, SHIPPING_PATH} from "../../src/cart/cart.controller";
import {Mongo} from "../../src/db/mongo";
import {appConfig} from "../../src/utils/config";
import {cart1, insertOne, newShippingBody1} from "../tests.utils/insert.cart";
import {appMock} from "../mocks/app.mock";
import {cartController} from "../tests.utils/controllers";
import {newQuantityBody1} from "../tests.utils/insert.product";
import {CartRepository} from "../../src/repository/cart.repository";
import supertest from "supertest";

describe(`PUT ${CART_PATH}${SHIPPING_PATH}`, () => {
    beforeAll(async () => {
        await Mongo.connect(appConfig.MONGO_URL)
        await insertOne(cart1)
    })

    afterAll(async () => {
        await Mongo.cart().drop()
        await Mongo.close()
    })

    it('should change shipping method for user cart', async () => {
        const changeShippingResponse = await supertest(appMock(cartController))
            .put(`${CART_PATH}${SHIPPING_PATH}`)
            .send(newShippingBody1)

        const cart = await CartRepository.findOne(cart1.cartId)

        expect(changeShippingResponse.status).toBe(200)

        expect(cart!.shippingCost).toBe(newShippingBody1.shippingMethod);
    })
})