const server = require('./server')

const port = process.env.PORT || 8000

const startServer = () => {
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
}

startServer()