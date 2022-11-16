const dotenv = require('dotenv-flow')

dotenv.config()

const required = (key: string, variable?: string) => {
  if (!variable)
    throw new Error(`Required property is missing: ${key}`)
  return variable
}

export const appConfig = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: required('MONGO_URL', process.env.MONGO_URL),
  URL_DOMAIN: required('URL_DOMAIN', process.env.URL_DOMAIN),
  SHARE_LINK_DOMAIN: required('SHARE_LINK_DOMAIN', process.env.SHARE_LINK_DOMAIN)
}
