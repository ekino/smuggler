const express = require('express')
const http = require('http')
const nockOnDemand = require('nock-on-demand')

const app = express()

let mockManager
nockOnDemand.initialize({
    baseDirectory: __dirname,
    services: [{
        host: 'foo.bar',
        name: 'fooBar'
    }]
}).then((it) => {
    mockManager = it
})

app.use(((req, res, next) => {
    const mockId = req.header('x-mock-id')

    if (mockId) {
        mockManager.activateMock(mockId)
    }

    next()

    if (mockId) {
        mockManager.resetMocks()
    }
}))

app.get('/', async (req, res) => {
    await new Promise(function(resolve, reject) {
        http.get(`http://foo.bar/say-hello?to=${req.query['to'] || 'World'}`, (message) => {
            let rawBody = ''
            message.on('data', (chunk) => { rawBody += chunk})

            const contentType = message.headers['content-type']
            message.on('end', () => {
                resolve({
                    status: message.statusCode,
                    body: contentType === 'application/json' ? JSON.parse(rawBody) : rawBody
                })
            })
        }).on('error', (error) => reject(error))
    }).then((body) => res.send(body))
        .catch((error) => res.status(500).send(error))
})

app.listen(3000, () => {
    console.log('Listening on port 3000.')
})
