import {CART_PATH} from "../../src/cart/cart.controller";
import {Mongo} from "../../src/db/mongo";
import {appConfig} from "../../src/utils/config";
import supertest from "supertest"
import {appMock} from "../mocks/app.mock";
import {cartController} from "../tests.utils/controllers";
import {product1, product2, productBody1, productBody2} from "../tests.utils/insert.product";
import {cart1, emptyCart, insertOne} from "../tests.utils/insert.cart";
import {CartRepository} from "../../src/repository/cart.repository";

describe(`POST ${CART_PATH}`, () => {
    beforeAll(async () => {
        await Mongo.connect(appConfig.MONGO_URL)
    })

    afterEach(async () => {
        await Mongo.cart().drop()
    })

    afterAll(async () => {
        await Mongo.close()
    })

    it('should add product to empty cart', async () => {
        await insertOne(emptyCart)

        const addProductResponse = await supertest(appMock(cartController))
            .post(CART_PATH)
            .send(productBody1)

        const cart = await CartRepository.findOne(emptyCart.cartId)

        expect(addProductResponse.status).toBe(201)

        expect(cart!.products).toStrictEqual([product1]);
        expect(cart!.totalValue).toBe(productBody1.price * productBody1.quantity)
    })

    it('should add product to non-empty cart', async () => {
        await insertOne(cart1)

        const addProductResponse = await supertest(appMock(cartController))
            .post(CART_PATH)
            .send(productBody2)

        const cart = await CartRepository.findOne(cart1.cartId)

        expect(addProductResponse.status).toBe(201)

        expect(cart!.products).toStrictEqual([...cart1.products, product2]);
        expect(cart!.totalValue).toBe(cart1.totalValue + (productBody2.price * productBody2.quantity))
    })
})