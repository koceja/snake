const express = require('express');
const app = express();

var bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Connected');
});


app.listen(3000, () => console.log('Listening on port 3000...'));