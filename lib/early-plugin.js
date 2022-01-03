const fastifyStatic = require('fastify-static')

module.exports = async function (scope, options) {
  const { config } = scope
  const { _, fs, aneka, defNdutKeys } = scope.ndut.helper
  const { requireBase } = aneka
  if (options.disabled) {
    scope.log.debug('- fastify-static')
    return
  }
  scope.log.debug('+ fastify-static')
  const opts = _.cloneDeep(_.omit(options, defNdutKeys))
  opts.root = config.dir.base + '/ndutStatic/assets'
  opts.prefix = '/' + opts.prefix
  fs.ensureDirSync(opts.root)
  scope.register(fastifyStatic,  opts)
  scope.log.debug(`+ Serve ${opts.prefix}/*`)

  for (const n of config.nduts) {
    const dir = `${n.dir}/ndutStatic/assets`
    if (!fs.existsSync(dir)) continue
    let nOpts = {}
    try {
      nOpts = await requireBase(`${n.dir}/ndutStatic/options.js`, scope)
    } catch (err) {}
    nOpts.root = dir
    nOpts.prefix = opts.prefix + '/' + n.prefix
    nOpts.decorateReply = false
    scope.register(fastifyStatic, nOpts)
    scope.log.debug(`+ Serve ${nOpts.prefix}/*`)
  }
}
