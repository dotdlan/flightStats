// Dependencies
const express = require('express')

//config
const app = express()
const PORT = process.env.PORT || 3000
require('dotenv').config()
app.use(express.static('public'))

//home route
app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.listen(PORT, () => {
    console.log('Listening on port:', PORT)
})