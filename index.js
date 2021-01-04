const { response } = require('express')
const express = require('express')
const cors = require('cors')
const app = express()
let morgan = require('morgan')

// Middleware
app.use(cors())
app.use(express.json())

morgan.token('type', function (req, res) { return req.headers['content-type'] })
app.use(morgan('tiny'))

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
// }

// app.use(requestLogger)

let persons = [
    {
        id: 1,
        name: "Javed",
        phone: 12345
    },
    {
        id: 2,
        name: "Yidan",
        phone: 123
    }

]

app.get('/', (req, res) => {
    // console.log("Testing!")
    res.send('Testing!')
})

app.get('/api/persons', (req, res) => {
    // console.log('Response', res)
    // console.log('Persons', persons)
    res.json(persons)
})

app.get('/api/info', (req, res) => {
    let numPersons = persons.length
    let currTime = new Date().toString()
    let html = `Phonebook has info for ${numPersons} people`
    html = html.concat(`<br /><br /> ${currTime}`)

    console.log(html)
    res.send(html)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log("id", id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

// Add New Person
app.post('/api/persons', (req, res) => {
    console.log(req.headers)
    const id = Math.floor(Math.random() * 1000)
    const person = req.body
    person.id = id

    console.log("adding person", person)
    if (!person.name) {
        console.log("name missing", person)
        return res.status(400).json({
            error: 'Name Missing'
        })
    } else if(!person.phone) {
        console.log("number", person)
        return res.status(400).json({
            error: 'Number Missing'
        })
    }

    // Check if name exists
    if (persons.some(p => p.name === person.name)) {
        return res.status(400).json({
            error: 'Name already exists'
        })
    }
    console.log('Post Person', person)
    persons.push(person)
    res.json(person)

})
// Delete Person
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id != id)

    res.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})