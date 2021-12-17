const path = require('path')

module.exports = async function () {
  const { fp, fs, aneka, getNdutConfig } = this.ndut.helper
  const { pathResolve } = aneka
  const { config } = this
  const name = 'ndut-static'
  const options = getNdutConfig('ndut-static') || {}
  options.root = options.root || (config.dir.base + '/static')
  if (!path.isAbsolute(options.root)) options.root = pathResolve(options.root)
  const earlyPlugin = fp(require('./lib/early-plugin'))

  return { name, options, earlyPlugin }
}
