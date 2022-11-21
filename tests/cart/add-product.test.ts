import { CART_PATH, PRODUCT_PATH } from '../../src/cart/cart.controller'
import { Mongo } from '../../src/db/mongo'
import { appConfig } from '../../src/utils/config'
import supertest from 'supertest'
import { appMock } from '../mocks/app.mock'
import { cartController } from '../tests.utils/controllers'
import { product1, productIds, productPrices, productQuantities } from '../tests.utils/insert.product'
import { emptyCart, insertOne } from '../tests.utils/insert.cart'
import { CartRepository } from '../../src/repository/cart.repository'
import { DEFAULT_USER_ID } from '../../src/auth/auth.request'

describe(`POST ${CART_PATH}${PRODUCT_PATH}`, () => {
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

    const addProductResponse = await supertest(appMock(cartController, DEFAULT_USER_ID))
      .post(`${CART_PATH}${PRODUCT_PATH}`)
      .send(product1)

    const cart = await CartRepository.findOne(emptyCart.cartId)
    expect(addProductResponse.status).toBe(201)

    expect(cart!.products).toStrictEqual([product1])
  })
})
