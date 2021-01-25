module.exports = {
    id: 'mock-two',
    serviceName: 'mockTwo',
    groupId: 'group-a',
    declareMock: (nock) => nock.get('/40931f7f-8751-4fcc-a8cb-30abd8bd8db4').reply(200),
}
