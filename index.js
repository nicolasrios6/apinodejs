const express = require('express')
const app = express()
const logger = require('./loggerMiddleware')
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Me tengo que suscribir a @midudev en Youtube',
    date: '04/01/2023',
    important: false
  },
  {
    id: 2,
    content: 'Tengo que aprender Nodejs',
    date: '05/01/2023',
    important: true
  },
  {
    id: 3,
    content: 'Repasar Reactjs',
    date: '06/01/2023',
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/notes', (request, response) => {
  response.json(notes)
})

app.get('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find((note) => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

app.post('/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
