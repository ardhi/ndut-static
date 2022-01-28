module.exports = async function () {
  const { _, getNdutConfig, dumpError } = this.ndut.helper
  const { getUrl } = this.ndutRoute.helper
  const config = getNdutConfig('ndut-route')
  const authConfig = getNdutConfig('ndut-auth')
  this.setErrorHandler((error, request, reply) => {
    dumpError(error)
    if (!error.isBoom) error = this.Boom.boomify(error)
    reply.code(error.output.statusCode).send()
  })
  this.setNotFoundHandler({
    preHandler: this.rateLimit ? this.rateLimit() : undefined
  }, (request, reply) => {
    throw new this.Boom.Boom('Page not found', { statusCode: 404 })
  })
}
