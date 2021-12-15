const path = require('path')

module.exports = async function (fastify) {
  const { fp, fs, aneka, getNdutConfig } = fastify.ndut.helper
  const { pathResolve } = aneka
  const { config } = fastify
  const name = 'ndut-static'
  const options = getNdutConfig(fastify, 'ndut-static') || {}
  options.root = options.root || (config.dir.base + '/static')
  if (!path.isAbsolute(options.root)) options.root = pathResolve(options.root)
  fs.ensureDirSync(options.root)
  const earlyPlugin = fp(require('./lib/early-plugin'))

  return { name, options, earlyPlugin }
}
