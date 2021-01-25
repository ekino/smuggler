module.exports = {
    id: 'hello-world',
    serviceName: 'fooBar',
    declareMock: (scope) => {
        scope.get('/say-hello')
            .query((query) => query['to'] === 'World')
            .reply(200, 'Hello World!')
            .get('/say-hello')
            .query((query) => query['to'] !== 'World')
            .reply(404, "I don't know you!")
    }
}
