const fastifyStatic = require('fastify-static')

module.exports = async function (scope, options) {
  const { config } = scope
  const { _, fs, aneka } = scope.ndut.helper
  const { requireBase } = aneka
  if (options.disabled) {
    scope.log.debug('- fastify-static')
    return
  }
  scope.log.debug('+ fastify-static')
  const opts = _.omit(options, ['name', 'dir', 'disabled', 'module'])
  opts.prefix = '/' + opts.prefix
  opts.root = config.dir.base + '/ndutStatic/static'
  fs.ensureDirSync(opts.root)
  scope.register(fastifyStatic,  opts)
  scope.log.debug(`+ Serve ${opts.prefix}/*`)

  for (const n of config.nduts) {
    const dir = `${n.dir}/ndutStatic/static`
    if (!fs.existsSync(dir)) continue
    let nOpts = {}
    try {
      nOpts = await requireBase(`${dir}/options.js`, scope)
    } catch (err) {}
    nOpts.root = dir
    nOpts.prefix = opts.prefix + '/' + n.prefix
    nOpts.decorateReply = false
    scope.register(fastifyStatic, nOpts)
    scope.log.debug(`+ Serve ${nOpts.prefix}/*`)
  }
}
