const handleMisc = require('../lib/handle-misc')
const fastifyStatic = require('fastify-static')
const path = require('path')

module.exports = async function (scope, options) {
  const { _, fs, fastGlob, aneka, defNdutKeys, getConfig, getNdutConfig } = scope.ndut.helper
  const config = getConfig()
  const { requireBase } = aneka
  scope.log.debug('* fastify-static')
  const opts = _.cloneDeep(_.omit(options, defNdutKeys))
  const decorators = ['main', 'reply', 'request']

  let hookFiles = []
  for (let n of config.nduts) {
    n = getNdutConfig(n)
    for (const d of decorators) {
      const file = `${n.dir}/ndutStatic/decorator/${d}.js`
      if (fs.existsSync(file)) {
        let mod = require(file)
        if (_.isFunction(mod)) mod = mod.call(scope)
        _.forOwn(mod, (v, k) => {
          scope['decorate' + (d === 'main' ? '' : _.upperFirst(d))](k, v)
        })
      }
    }
    hookFiles = _.concat(hookFiles, await fastGlob(`${n.dir}/ndutStatic/hook/*.js`))
  }
  if (hookFiles.length > 0) {
    for (const f of hookFiles) {
      const method = _.camelCase(path.basename(f, '.js'))
      scope.addHook(method, require(f))
    }
  }
  for (let n of config.nduts) {
    n = getNdutConfig(n)
    const dir = `${n.dir}/ndutStatic/assets`
    if (!fs.existsSync(dir)) continue
    let nOpts = {}
    try {
      nOpts = await requireBase(`${n.dir}/ndutStatic/options.js`, scope)
    } catch (err) {}
    nOpts.root = dir
    nOpts.prefix = n.name === 'app' ? '' : ('/' + n.prefix)
    if (n.name !== 'app') nOpts.decorateReply = false
    await scope.register(fastifyStatic, nOpts)
    scope.log.debug(`* Serve ${n.name === 'app' ? opts.prefix : (nOpts.prefix + '/*')}`)
  }
  await handleMisc.call(scope)
}
