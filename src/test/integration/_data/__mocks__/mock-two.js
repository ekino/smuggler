const nock = require('nock')

module.exports = {
    id: 'mock-two',
    groupId: 'group-a',
    declareMock: () =>
        nock('https://mock-two.foo.bar', { allowUnmocked: false })
            .get('/40931f7f-8751-4fcc-a8cb-30abd8bd8db4')
            .reply(200),
}
