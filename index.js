const path = require('path')

module.exports = async function () {
  const { fp, getNdutConfig } = this.ndut.helper
  const name = 'ndut-static'
  const options = getNdutConfig('ndut-static') || {}
  const earlyPlugin = fp(require('./lib/early-plugin'))

  return { name, options, earlyPlugin }
}
