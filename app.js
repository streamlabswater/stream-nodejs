const express = require('express')
const path = require('path')
const logger = require('morgan')
const Liquid = require('liquidjs')
const session = require('express-session')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
loadLanguages(['json'])

const indexRouter = require('./routes/index')
const streamlabsRouter = require('./routes/streamlabs')
const engine = Liquid({
  root: path.join(__dirname, 'templates'),
  extname: '.liquid'
})

engine.registerFilter('highlight', (payload) => Prism.highlight(JSON.stringify(payload, null, 4), Prism.languages.json, 'json'))

const app = express()

app.use(session({
  name: 'stream.customer',
  secret: 'hot water is essential',
  resave: true,
  saveUninitialized: true,
  // store: new FileStore(),
  cookie: {
    path: '/',
    maxAge: 24 * 60 * 60 * 1000
  }
}))

// view engine setup
app.engine('liquid', engine.express())
app.set('views', ['./templates/partials', './templates/views'])
app.set('view engine', 'liquid')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/streamlabs', streamlabsRouter)

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = err

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
