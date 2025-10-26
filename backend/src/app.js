const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Serve theme config and static frontend
app.use('/static', express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')))
app.use('/etc', express.static(path.join(__dirname, '..', '..', 'www.vaticannews.va', 'etc')))

app.get('/api/theme', (req, res) => {
  const cfgPath = path.join(__dirname, '..', '..', 'theme', 'config.json')
  res.sendFile(cfgPath)
})

app.get('/', (req, res) => {
  res.send('VaticanNews backend scaffold is running')
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Backend listening on ${port}`))
