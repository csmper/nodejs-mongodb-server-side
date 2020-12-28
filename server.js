const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const path = require('path')
const api = require('./routes/api')

const port = 4000

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "..", "/client-side/dist/client-side/")))

app.use('/api', api)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "/client-side/dist/client-side/index.html"))
})

app.listen(port, () => {
    console.log(`Server listening on the port ${port}`)
})
