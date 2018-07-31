const path = require('path')
const { debug, devPort } = require('./environment')

exports.alias = {
    '@containers': path.resolve(__dirname, '../app/containers'),
    '@components': path.resolve(__dirname, '../app/presentational'),
    '@screens': path.resolve(__dirname, '../app/screen'),
    '@actions': path.resolve(__dirname, '../app/actions'),
    '@reducers': path.resolve(__dirname, '../app/reducers'),
    // '@assets': path.resolve(__dirname, '../assets'),
    '@assets': debug ? `http://localhost:${devPort}/assets` : '/content/SW_CORE.zip/images',
    '@styles': path.resolve(__dirname, '../styles'),
    '@util': path.resolve(__dirname, '../util'),
    '@vender': path.resolve(__dirname, '../vendor'),
}
