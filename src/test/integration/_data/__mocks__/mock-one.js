module.exports = {
    id: 'mock-one',
    serviceName: 'mockOne',
    groupId: 'group-a',
    declareMock: (nock) => nock.get('/9cfc1197-c21d-4561-ae34-991837e780ef').reply(200),
}
