import { CART_PATH, PRODUCT_PATH, QUANTITY_PATH } from '../../src/cart/cart.controller'
import { Mongo } from '../../src/db/mongo'
import { appConfig } from '../../src/utils/config'
import { cart1, insertOne } from '../tests.utils/insert.cart'
import { appMock } from '../mocks/app.mock'
import { cartController } from '../tests.utils/controllers'
import { newQuantityBody1, product1 } from '../tests.utils/insert.product'
import { CartRepository } from '../../src/repository/cart.repository'
import supertest from 'supertest'
import { DEFAULT_USER_ID } from '../../src/auth/auth.request'

describe(`PUT ${CART_PATH}${PRODUCT_PATH}/:productId${QUANTITY_PATH}`, () => {
  beforeAll(async () => {
    await Mongo.connect(appConfig.MONGO_URL)
    await insertOne(cart1)
  })

  afterAll(async () => {
    await Mongo.cart().drop()
    await Mongo.close()
  })

  it('should change quantity of product in cart', async () => {
    const changeQuantityResponse = await supertest(appMock(cartController, DEFAULT_USER_ID))
      .put(`${CART_PATH}${PRODUCT_PATH}/${product1.productId}${QUANTITY_PATH}`)
      .send(newQuantityBody1)

    const cart = await CartRepository.findOne(cart1.cartId)

    expect(changeQuantityResponse.status).toBe(200)
    expect(cart!.products[0].quantity).toStrictEqual(newQuantityBody1.newQuantity)
  })
})
