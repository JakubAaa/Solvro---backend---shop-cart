import { app } from './app'
import { appConfig } from './utils/config'
import { Mongo } from './db/mongo'

Mongo.connect(appConfig.MONGO_URL).then(() => {
  app.listen(appConfig.PORT)
})
