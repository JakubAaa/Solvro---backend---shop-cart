import { Db, MongoClient } from 'mongodb'
import { Cart } from '../cart/cart.interfaces'

const CART = 'cart'

export class Mongo {
  private static mongo: Db
  private static client: MongoClient

  public static connect = (url: string): Promise<Db> =>
    MongoClient.connect(url)
      .then(c => this.client = c)
      .then(c => this.mongo = c.db())
      .then(db => db)

  public static close = () => this.client.close()
  public static cart = () => Mongo.mongo.collection<Cart>(CART)
}
