var fs = require('fs')
var Hjson = require('hjson')

function genStringResource() {
  try {
    const data = fs.readFileSync('./src/locales/vi/translation.json', 'utf8')
    const json = Hjson.parse(data)
    const stringName = Object.keys(json)
    fs.writeFileSync(
      './src/utils/strings.ts',
      `import i18n from '../translation.js'
    function strings() {
        return {${stringName.map((string, index) => {
          var path = ``
          if (typeof json[string] == 'string') {
            path = `
          ${string}: i18n.t('${string}')`
          } else {
            var keys = Object.keys(json[string])
            keys.map((val, i) => {
              path += `
          ${string}_${val}: i18n.t('${string}.${val}')${
                i != keys.length - 1 ? ',' : ''
              }`
            })
          }
          return path
        })}}
        }
        export default strings
        `
    )
    console.log(
      `============== Linked ${stringName.length} string ==============`
    )
  } catch (error) {
    console.log(error)
  }
}

function genImageResource() {
  fs.readdir('./src/assets/images', function (err, fileName) {
    if (err) {
      console.log('genImageResource error', err)
      return
    }
    fs.writeFileSync(
      './src/utils/images.ts',
      `const images = {
        ${fileName.map(iconName => {
          path = `
          ${iconName
            .replace('.png', '')
            .replace(
              '.jpg',
              ''
            )}: require('../assets/images/${iconName}').default`
          return path
        })}
      }
      export default images`
    )
  })
}
genImageResource()
genStringResource()
