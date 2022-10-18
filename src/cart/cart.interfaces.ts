export interface Cart {
    cartId: string,
    userId: string,
    products: ProductInCart[],
    totalValue: number
}

export interface ProductBody {
    productId: string,
    quantity: number,
    price: number
}

export interface ProductInCart {
    productId: string,
    quantity: number
}