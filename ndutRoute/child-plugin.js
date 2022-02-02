const handleMisc = require('../lib/handle-misc')
const fastifyStatic = require('fastify-static')
const path = require('path')

module.exports = async function (scope, options) {
  const { _, fs, fastGlob, aneka, defNdutKeys, getConfig, getNdutConfig } = scope.ndut.helper
  const { requireBase } = aneka
  const { prepInterception } = scope.ndutRoute.helper
  const config = getConfig()
  scope.log.debug('* fastify-static')
  await prepInterception(scope, 'ndutStatic')
  const opts = _.cloneDeep(_.omit(options, defNdutKeys))
  for (const n of config.nduts) {
    const cfg = getNdutConfig(n)
    const dir = `${cfg.dir}/ndutStatic/assets`
    if (!fs.existsSync(dir)) continue
    let nOpts = {}
    try {
      nOpts = await requireBase(`${cfg.dir}/ndutStatic/options.js`, scope)
    } catch (err) {}
    nOpts.root = dir
    nOpts.prefix = cfg.name === 'app' ? '' : ('/' + cfg.prefix)
    if (cfg.name !== 'app') nOpts.decorateReply = false
    await scope.register(fastifyStatic, nOpts)
    scope.log.debug(`* Serve /${opts.prefix}${nOpts.prefix}/*`)
  }
  await handleMisc.call(scope)
}
