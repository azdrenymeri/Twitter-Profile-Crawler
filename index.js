const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const index = require('./routes/index');

// template engine configuration
app.set('views','./views');
app.set('view engine', 'ejs')

// setting the static directory
app.use(express.static('public'));

// setting the body parser middleware
app.use(bodyParser.json());

// routes
app.use('/',index);

// app startup
const port = process.env.PORT || 3000;
app.listen(port,() => {
 console.log(`Server started on port ${port}`)   
})