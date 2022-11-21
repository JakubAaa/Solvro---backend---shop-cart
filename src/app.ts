import express from 'express'
import { errorHandler } from './error/error.handler'
import { CartController } from './cart/cart.controller'
import { CartService } from './cart/cart.service'
import { authenticateDemoUser, DEFAULT_USER_ID } from './auth/auth.request'
import 'express-async-errors'

export const cartController = new CartController(new CartService()).router

export const app = express()
  .use(express.json())
  .use(authenticateDemoUser(DEFAULT_USER_ID))
  .use(cartController)
  .use(errorHandler)
