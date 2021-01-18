const path = require('path')

const templates = [
  {
    template: path.resolve(__dirname, '../src/hbs/pages/index.hbs'),
    filename: 'index.html',
  }
]

// inject scripts before closing body tag
templates.forEach(template => template.inject = 'body')

module.exports = templates