module.exports = async function (options) {
  const { fs, getNdutConfig } = this.ndut.helper
  const config = getNdutConfig('app')
  fs.ensureDirSync(`${config.dir}/ndutStatic/assets`)
}
