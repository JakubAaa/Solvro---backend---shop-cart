import {CART_PATH, PRODUCT_PATH} from "../../src/cart/cart.controller";
import {Mongo} from "../../src/db/mongo";
import {appConfig} from "../../src/utils/config";
import supertest from "supertest"
import {appMock} from "../mocks/app.mock";
import {cartController} from "../tests.utils/controllers";
import {product1, product2} from "../tests.utils/insert.product";
import {cart1, insertOne} from "../tests.utils/insert.cart";
import {CartRepository} from "../../src/repository/cart.repository";
import {DEFAULT_USER_ID} from "../../src/auth/auth.request";

describe(`DELETE ${CART_PATH}${PRODUCT_PATH}`, () => {
    beforeAll(async () => {
        await Mongo.connect(appConfig.MONGO_URL)
        await insertOne(cart1)
    })

    afterAll(async () => {
        await Mongo.cart().drop()
        await Mongo.close()
    })

    it('should delete product from cart', async () => {
        const deleteProductResponse = await supertest(appMock(cartController, DEFAULT_USER_ID))
            .delete(`${CART_PATH}${PRODUCT_PATH}/${product1.productId}`)
            .send()

        const cart = await CartRepository.findOne(cart1.cartId)

        expect(deleteProductResponse.status).toBe(200)

        expect(cart!.products).toStrictEqual([product2]);
    })
})