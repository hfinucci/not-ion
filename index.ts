import express, { Express, Request, Response } from 'express'
const port = 8000
const app: Express = express()

app.get('/', (req, res) => {
    res.send("que haces mundo")
})

app.listen(port, () => {
    console.log('listening on port 8000...')
})