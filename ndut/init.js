const fastifyStatic = require('fastify-static')

module.exports = async function () {
  const { _, fs, aneka, defNdutKeys, getConfig, getNdutConfig } = this.ndut.helper
  const config = await getConfig()
  const options = await getNdutConfig('ndut-static')
  const { requireBase } = aneka
  this.log.debug('* fastify-static')
  const opts = _.cloneDeep(_.omit(options, defNdutKeys))

  for (let n of config.nduts) {
    n = await getNdutConfig(n)
    const dir = `${n.dir}/ndutStatic/assets`
    if (n.name === 'app') fs.ensureDirSync(n.dir)
    if (!fs.existsSync(dir)) continue
    let nOpts = {}
    try {
      nOpts = await requireBase(`${n.dir}/ndutStatic/options.js`, this)
    } catch (err) {}
    nOpts.root = dir
    nOpts.prefix = n.name === 'app' ? ('/' + opts.prefix) : (opts.prefix + '/' + n.prefix)
    if (n.name !== 'app') nOpts.decorateReply = false
    await this.register(fastifyStatic, nOpts)
    this.log.debug(`* Serve ${n.name === 'app' ? opts.prefix : 'nOpts.prefix}/*'}`)
  }
}
