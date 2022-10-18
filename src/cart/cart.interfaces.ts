export interface Cart {
    cartId: string,
    userId: string,
    products: [ProductInCart],
    totalValue: number
}

export interface ProductInCart {
    productId: string,
    quantity: number
}