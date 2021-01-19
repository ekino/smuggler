const nock = require('nock')

module.exports = {
    id: 'mock-one',
    groupId: 'group-a',
    declareMock: () =>
        nock('https://mock-one.foo.bar', { allowUnmocked: false })
            .get('/9cfc1197-c21d-4561-ae34-991837e780ef')
            .reply(200),
}
