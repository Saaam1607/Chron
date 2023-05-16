const server = require('./server')
const db = require('./components/gestoreDB/gestoreDB')

const port = process.env.PORT || 8000

const startServer = () => {
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
}

startServer()