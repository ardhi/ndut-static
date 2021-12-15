const fastifyStatic = require('fastify-static')

module.exports = async function (fastify, options) {
  const { _ } = fastify.ndut.helper
  if (options.disabled) {
    fastify.log.debug('- fastify-static')
  } else {
    fastify.log.debug('+ fastify-static')
    const opts = _.omit(options, ['name', 'dir', 'disabled', 'module'])
    opts.prefix = '/' + opts.prefix
    fastify.register(fastifyStatic,  opts)
    // TODO: cascade add nduts assets
  }
}
