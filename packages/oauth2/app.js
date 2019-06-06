'use strict'

const express = require('express')
const path = require('path')
const logger = require('morgan')
const Liquid = require('liquidjs')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
loadLanguages(['json', 'http'])

/**
 * setup ui engine and add filters
 */
const engine = new Liquid({
  root: path.join(__dirname, 'templates/'),
  extname: '.liquid'
})

engine.registerFilter('highlight', (source, lang) => {
  if (!source) {
    return
  }

  if (lang === 'json') {
    return Prism.highlight(JSON.stringify(source, null, 2), Prism.languages.json, 'json')
  }

  return Prism.highlight(source, Prism.languages[lang], lang)
})
engine.registerFilter('formatted', (source) => JSON.stringify(source, null, 2))

const app = express()
app.use(session({
  store: new SQLiteStore(),
  name: 'stream.customer',
  secret: 'hot water',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: false,
    path: '/',
    maxAge: 24 * 60 * 60 * 1000
  }
}))

/**
 * App view setup directories
 */
app.engine('liquid', engine.express())
app.set('views', ['./templates/partials', './templates/views'])
app.set('view engine', 'liquid')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(function (req, res, next) {
  req.session.env = req.session.env || 'dev'
  res.locals.env = req.session.env
  req.session.save()
  next()
})

app.use('/', require('./routes'))
app.use('/streamlabs', require('./routes/streamlabs'))

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = err

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
