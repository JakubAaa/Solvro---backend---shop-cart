import {CART_PATH} from "../../src/cart/cart.controller";
import {Mongo} from "../../src/db/mongo";
import {appConfig} from "../../src/utils/config";
import supertest from "supertest"
import {appMock} from "../mocks/app.mock";
import {cartController} from "../tests.utils/controllers";
import {cart1, insertOne} from "../tests.utils/insert.cart";

describe(`GET ${CART_PATH}`, () => {
    beforeAll(async () => {
        await Mongo.connect(appConfig.MONGO_URL)
        await insertOne(cart1)
    })

    afterAll(async () => {
        await Mongo.cart().drop()
        await Mongo.close()
    })

    it('should return a cart', async () => {
        const addProductResponse = await supertest(appMock(cartController))
            .get(CART_PATH)
            .send()

        expect(addProductResponse.status).toBe(200)

        expect(addProductResponse.body).not.toHaveProperty('cartId');
        expect(addProductResponse.body).not.toHaveProperty('userId');

        expect(addProductResponse.body.products).toStrictEqual(cart1.products);
        expect(addProductResponse.body.totalValue).toBe(cart1.totalValue);
    })
})