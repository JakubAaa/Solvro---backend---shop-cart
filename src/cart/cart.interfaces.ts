export interface Cart {
    cartId: string,
    userId: string,
    products: Product[]
    discountCode?: number
}

export interface Product {
    productId: string,
    quantity: number,
    price: number
}

export interface QuantityBody {
    newQuantity: number
}