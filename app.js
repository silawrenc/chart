'use strict';

const express = require('express');
const exphbs  = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');
const generator = require('./src/generator');

const app = express();
const port = process.env.PORT || 8080;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.disable('x-powered-by');
app.use(morgan('tiny'));
app.use(express.static('./public'));

// chart page
app.get('/', (req, res) => res.render('chart'));

// serve some data generated using params from request
// add a simulated a delay as if some real work was being done
app.get('/data', (req, res) => setTimeout(() => res.json(generator(req.query)), 2000));

// 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.resolve('./public/500.html'));
});

//404
app.use((req, res) => res.status(404).sendFile(path.resolve("./public/404.html")));

app.listen(port, () => console.log(`listening on ${port}`));
