'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // BASE_URL: '"http://project.30days-tech.com"'
    BASE_URL: '"https://api.echongya.com"'
})