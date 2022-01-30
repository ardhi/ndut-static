module.exports = async function () {
  const { dumpError } = this.ndut.helper
  this.setErrorHandler((error, request, reply) => {
    dumpError(error)
    if (!error.isBoom) error = this.Boom.boomify(error)
    reply
      .code(error.output.statusCode)
      .send()
  })
  this.setNotFoundHandler({
    preHandler: this.rateLimit ? this.rateLimit() : undefined
  }, (request, reply) => {
    throw new this.Boom.Boom('Page not found', { statusCode: 404 })
  })
}
