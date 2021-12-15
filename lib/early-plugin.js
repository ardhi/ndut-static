const fastifyStatic = require('fastify-static')

module.exports = async function (fastify, options) {
  const { config } = fastify
  const { _, fs, aneka } = fastify.ndut.helper
  const { requireBase } = aneka
  if (options.disabled) {
    fastify.log.debug('- fastify-static')
    return
  }
  fastify.log.debug('+ fastify-static')
  const opts = _.omit(options, ['name', 'dir', 'disabled', 'module'])
  opts.prefix = '/' + opts.prefix
  fastify.register(fastifyStatic,  opts)

  for (const n of config.nduts) {
    const dir = `${n.dir}/ndutStatic/static`
    if (!fs.existsSync(dir)) continue
    let nOpts = {}
    try {
      nOpts = await requireBase(`${dir}/options.js`, fastify)
    } catch (err) {}
    nOpts.root = dir
    nOpts.prefix = opts.prefix + '/' + n.prefix
    nOpts.decorateReply = false
    fastify.register(fastifyStatic, nOpts)
  }
}
