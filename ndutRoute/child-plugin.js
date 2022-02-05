const handleMisc = require('../lib/handle-misc')
const fastifyStatic = require('fastify-static')
const path = require('path')

module.exports = async function (scope, options) {
  const { _, fs, aneka, defNdutKeys, getConfig, getNdutConfig } = scope.ndut.helper
  scope.ndutStatic.instance = fastifyStatic
  const { requireBase } = aneka
  const { prepInterception } = scope.ndutRoute.helper
  const config = getConfig()
  scope.log.debug('* fastify-static')
  await prepInterception(scope, 'ndutStatic')
  const opts = _.cloneDeep(_.omit(options, defNdutKeys))
  for (const n of config.nduts) {
    const cfg = getNdutConfig(n)
    const dir = `${cfg.dir}/ndutStatic/assets`
    if (fs.existsSync(dir)) {
      let nOpts = {}
      try {
        nOpts = await requireBase(`${cfg.dir}/ndutStatic/option.js`, scope)
      } catch (err) {}
      nOpts.root = dir
      nOpts.prefix = cfg.name === 'app' ? '' : ('/' + cfg.prefix)
      if (cfg.name !== 'app') nOpts.decorateReply = false
      await scope.register(fastifyStatic, nOpts)
      scope.log.debug(`* Serve /${opts.prefix}${nOpts.prefix}/*`)
    }
    // virtual
    try {
      let virts = await requireBase(`${cfg.dir}/ndutStatic/virtuals.json`, scope)
      if (_.isPlainObject(virts)) virts = [virts]
      for (const v of virts) {
        v.prefix = (cfg.name === 'app' ? '' : ('/' + cfg.prefix)) + '/' + _.trim(v.prefix, '/')
        v.decorateReply = false
        await scope.register(fastifyStatic, v)
        scope.log.debug(`* Serve /${opts.prefix}${v.prefix}/*`)
      }
    } catch (err) {}
  }
  await handleMisc.call(scope)
}
