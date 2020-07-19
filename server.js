const express = require('express');
const path = require('path')
const app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});


app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000...'));