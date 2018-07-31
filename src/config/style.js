const autoprefixer = require('autoprefixer')

exports.postCssLoader = {
    loader: 'postcss-loader',
    options: {
        ident: 'postcss',

        // adds prefix - eg -webkit-
        plugins: () => [autoprefixer()]
    }
}

exports.sassLoader = {
    loader: 'sass-loader',
    options: {

        // allows local scope styling
        modules: true,
        localIdentName: '[name]__[local]___[hash:base64:5]'
    }
}
