import { CART_PATH, SHARE_PATH } from '../../src/cart/cart.controller'
import { Mongo } from '../../src/db/mongo'
import { appConfig } from '../../src/utils/config'
import supertest from 'supertest'
import { appMock } from '../mocks/app.mock'
import { cartController } from '../tests.utils/controllers'
import { cart2, insertOne } from '../tests.utils/insert.cart'
import { CartRepository } from '../../src/repository/cart.repository'
import { DEFAULT_NUMBER_OF_USES } from '../../src/cart/cart.service'
import { DEFAULT_USER_ID } from '../../src/auth/auth.request'
import moment from 'moment'

describe(`POST ${CART_PATH}${SHARE_PATH}`, () => {
  beforeAll(async () => {
    await Mongo.connect(appConfig.MONGO_URL)
    await insertOne(cart2)
  })

  afterAll(async () => {
    await Mongo.cart().drop()
    await Mongo.close()
  })

  it('should set properties in cart and generate sharing link', async () => {
    Date.now = jest.fn(() => new Date(Date.UTC(2025, 10, 1)).valueOf())
    const generateLinkResponse = await supertest(appMock(cartController, DEFAULT_USER_ID))
      .post(`${CART_PATH}${SHARE_PATH}`)
      .send()

    const cart = await CartRepository.findOne(cart2.cartId)

    expect(generateLinkResponse.status).toBe(201)
    expect(generateLinkResponse.body.link).toBeDefined()

    expect(cart!.sharingCartId).toBeDefined()
    expect(cart!.sharingLinkTTL).toBeDefined()
    expect(cart!.sharingLinkTTL!.valueOf()).toStrictEqual(moment().add(2, 'hour').valueOf())
    expect(cart!.leftLinkUsages).toBe(DEFAULT_NUMBER_OF_USES)
  })
})
