import {Controller} from "../utils/controller";
import {Response, Router} from "express";
import {CartService} from "./cart.service";
import {AuthRequest, AuthUser} from "../auth/auth.request.interface";
import {ProductInCart} from "./cart.interfaces";
import {addProductToCartSchema} from "./validation/req.data";
import {validate} from "../utils/validator";

export const CART_PATH = "/cart";

export class CartController implements Controller {
    router = Router();

    constructor(private cartService: CartService) {
        this.router.post(CART_PATH, validate(addProductToCartSchema), (req: AuthRequest, res: Response) =>
            this.addProduct(req.user, req.body).then(() => res.sendStatus(201)))
    }

    addProduct(
        user: AuthUser,
        body: ProductInCart
    ) {
        return this.cartService.addProduct(user, body);
    }
}