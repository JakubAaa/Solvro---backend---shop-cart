import {CART_PATH, SHARE_PATH} from "../../src/cart/cart.controller";
import {Mongo} from "../../src/db/mongo";
import {appConfig} from "../../src/utils/config";
import supertest from "supertest"
import {appMock, DIFFERENT_USER_ID} from "../mocks/app.mock";
import {cartController} from "../tests.utils/controllers";
import {
    cartToShare,
    cartWithoutMoreNumberOfUses,
    cartWithOutOfDateTTL,
    insertMany,
    insertOne,
    otherUserCart
} from "../tests.utils/insert.cart";
import {CartRepository} from "../../src/repository/cart.repository";
import {ErrorDatas} from "../../src/error/error.datas";
import {ErrorCodes} from "../../src/error/error.codes";
import {DEFAULT_USER_ID} from "../../src/auth/auth.request";

describe(`POST ${CART_PATH}${SHARE_PATH}/:sharingCartId`, () => {
    beforeAll(async () => {
        await Mongo.connect(appConfig.MONGO_URL)
    })

    afterEach(async () => {
        await Mongo.cart().drop()
    })

    afterAll(async () => {
        await Mongo.close()
    })

    it('should import cart by link', async () => {
        await insertMany([otherUserCart, cartToShare])

        const importCartResponse = await supertest(appMock(cartController, DIFFERENT_USER_ID))
            .post(`${CART_PATH}${SHARE_PATH}/${cartToShare.sharingCartId}`)
            .send()

        expect(importCartResponse.status).toBe(201)

        const importedCart = await CartRepository.findUserCart(DIFFERENT_USER_ID);
        const cartToImport = await CartRepository.findOne(cartToShare.cartId);

        expect(importedCart!.products).toStrictEqual(cartToShare.products)
        expect(importedCart!.shippingCost).toBe(cartToShare.shippingCost)
        expect(importedCart!.discountCode).toBe(cartToShare.discountCode)

        expect(cartToImport!.sharingLinkPossibleNumberOfUses).toBe(cartToShare.sharingLinkPossibleNumberOfUses! - 1)
    })

    it('should not import cart - user used his own link to his own cart', async () => {
        await insertOne(cartToShare)

        const importCartResponse = await supertest(appMock(cartController, DEFAULT_USER_ID))
            .post(`${CART_PATH}${SHARE_PATH}/${cartToShare.sharingCartId}`)
            .send()

        expect(importCartResponse.status).toBe(201)

        const cart = await CartRepository.findUserCart(DEFAULT_USER_ID);

        expect(cart!.products).toStrictEqual(cartToShare.products)
        expect(cart!.shippingCost).toBe(cartToShare.shippingCost)
        expect(cart!.discountCode).toBe(cartToShare.discountCode)
    })

    it('should throw error 404 - cart does not exist', async () => {
        await insertOne(otherUserCart)

        const importCartResponse = await supertest(appMock(cartController, DIFFERENT_USER_ID))
            .post(`${CART_PATH}${SHARE_PATH}/"wrong-sharing-id"`)
            .send()

        expect(importCartResponse.status).toBe(404)

        expect(importCartResponse.body.data).toStrictEqual(ErrorDatas.RESOURCE_NOT_FOUND)
        expect(importCartResponse.body.code).toStrictEqual(ErrorCodes.RESOURCE_NOT_FOUND)
    })

    it('should throw error 404 - TTL is out of date', async () => {
        await insertOne(cartWithOutOfDateTTL)

        const importCartResponse = await supertest(appMock(cartController, DIFFERENT_USER_ID))
            .post(`${CART_PATH}${SHARE_PATH}/${cartWithOutOfDateTTL.sharingCartId}`)
            .send()

        expect(importCartResponse.status).toBe(404)

        expect(importCartResponse.body.data).toStrictEqual(ErrorDatas.RESOURCE_NOT_FOUND)
        expect(importCartResponse.body.code).toStrictEqual(ErrorCodes.RESOURCE_NOT_FOUND)
    })

    it('should throw error 404 - link has not more number of uses', async () => {
        await insertOne(cartWithoutMoreNumberOfUses)

        const importCartResponse = await supertest(appMock(cartController, DIFFERENT_USER_ID))
            .post(`${CART_PATH}${SHARE_PATH}/${cartWithoutMoreNumberOfUses.sharingCartId}`)
            .send()

        expect(importCartResponse.status).toBe(404)

        expect(importCartResponse.body.data).toStrictEqual(ErrorDatas.RESOURCE_NOT_FOUND)
        expect(importCartResponse.body.code).toStrictEqual(ErrorCodes.RESOURCE_NOT_FOUND)
    })
})