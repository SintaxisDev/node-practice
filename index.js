const express = require('express')
const logger = require('./loggerMiddleware')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use(logger)

let notes = [
	{
		id: 1,
		content: 'Me tengo que suscribir a @midudev en YouTube',
		date: '2019-05-30T17:30:31.0982',
		important: true,
	},
	{
		id: 2,
		content: 'Repasar los retos de JS de midudev',
		date: '2019-05-30T17:30:31.0982',
		important: false,
	},
	{
		id: 3,
		content: 'Tengo que estudiar las clases del FullStack Bootcamp',
		date: '2019-05-30T17:30:31.0982',
		important: true,
	},
]

app.get('/', (request, response) => {
	response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
	response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
	const id = request.params.id
	const note = notes.find((note) => note.id === +id)
	note ? response.json(note) : response.status(404).end()
})

app.delete('/api/notes/:id', (request, response) => {
	const id = request.params.id
	notes = notes.filter((note) => note.id !== +id)
	response.status(204).end()
})

app.post('/api/notes', (request, response) => {
	const note = request.body

	if (!note || !note.content) {
		return response.status(400).json({
			error: 'note.content is missing',
		})
	} else {
		const ids = notes.map((note) => note.id)
		const maxId = Math.max(...ids)
		const newNote = {
			id: maxId + 1,
			content: note.content,
			important:
				typeof note.important !== 'undefinded' ? note.important : false,
			date: new Date().toISOString(),
		}

		notes = [...notes, newNote]

		response.status(201).json(newNote)
	}
})

app.use((request, response) => {
	response.status(404).json({
		error: 'Not found',
	})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
