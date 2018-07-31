const { alias } = require('./alias')
const { postCssLoader, sassLoader } = require('./style')
const { JsUglify } = require('./script')
const { debug, devPort } = require('./environment')

module.exports = {
    alias, postCssLoader, sassLoader, JsUglify, debug, devPort
}
