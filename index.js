const { _, fp, fs, aneka, getNdutConfig } = require('ndut-helper')
const { pathResolve } = aneka
const path = require('path')
const fastifyStatic = require('fastify-static')

const plugin = fp(async function (fastify, options) {
  if (options.disabled) {
    fastify.log.debug('- fastify-static')
  } else {
    fastify.log.debug('+ fastify-static')
    const opts = _.omit(options, ['name', 'dir', 'disabled', 'module'])
    opts.prefix = '/' + opts.prefix
    fastify.register(fastifyStatic,  opts)
    // TODO: cascade add nduts assets
  }
})

module.exports = async function (fastify) {
  const { config } = fastify
  const options = getNdutConfig(fastify, 'ndut-static') || {}
  options.root = options.root || (config.dir.base + '/static')
  options.prefix = options.prefix || 'assets'
  if (!path.isAbsolute(options.root)) options.root = pathResolve(options.root)
  fs.ensureDirSync(options.root)
  return { options, plugin, registerEarly: true }
}
