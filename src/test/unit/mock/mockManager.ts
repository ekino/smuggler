import avaTest, { TestInterface } from 'ava'
import nock from 'nock'
import { createStubInstance, mock, SinonStub, SinonStubbedInstance, stub } from 'sinon'

import { TechnicalError } from '../../../lib/error'
import { ErrorCode } from '../../../lib/error/definitions'
import { MockDefinitionRepository, MockManager } from '../../../lib/mock'
import { JavaScriptMockDefinition, MockDefinition } from '../../../lib/mock/loader'
import { ScopeRepository } from '../../../lib/mock/scopeRepository'
import { getFakeScope, getMockDefinition } from '../../_utils/data'

type TestContext = {
    activeMocksStub: SinonStub
    pendingMocksStub: SinonStub
    cleanAllStub: SinonStub
    mockDefinitionRepositoryStub: SinonStubbedInstance<MockDefinitionRepository>
    scopeRepositoryStub: SinonStubbedInstance<ScopeRepository>
    mockManager: MockManager
}

const test = avaTest as TestInterface<TestContext>

test.before((t) => {
    t.context.mockDefinitionRepositoryStub = createStubInstance<MockDefinitionRepository>(MockDefinitionRepository)
    t.context.scopeRepositoryStub = createStubInstance<ScopeRepository>(ScopeRepository)
    t.context.activeMocksStub = stub(nock, 'activeMocks')
    t.context.pendingMocksStub = stub(nock, 'pendingMocks')
    t.context.cleanAllStub = stub(nock, 'cleanAll')

    t.context.mockManager = new MockManager(
        (t.context.mockDefinitionRepositoryStub as unknown) as MockDefinitionRepository,
        (t.context.scopeRepositoryStub as unknown) as ScopeRepository
    )
})

test.beforeEach(
    ({
        context: { mockDefinitionRepositoryStub, scopeRepositoryStub, activeMocksStub, pendingMocksStub, cleanAllStub },
    }) => {
        mockDefinitionRepositoryStub.getById.reset()
        mockDefinitionRepositoryStub.getByGroupId.reset()
        scopeRepositoryStub.getByName.reset()
        activeMocksStub.reset()
        pendingMocksStub.reset()
        cleanAllStub.reset()
    }
)

test.after(({ context: { activeMocksStub, pendingMocksStub, cleanAllStub } }) => {
    activeMocksStub.restore()
    pendingMocksStub.restore()
    cleanAllStub.restore()
})

test('mockManager.activateMock should activate the definition', ({
    context: { mockDefinitionRepositoryStub, scopeRepositoryStub, mockManager },
    ...t
}) => {
    const mockId = '06ad0ae8-bffb-4753-8cf0-ab540da6281f'

    const scope = getFakeScope()

    const declareMockSpy = mock().returnsThis()

    const mockDefinition: JavaScriptMockDefinition = getMockDefinition({
        kind: 'js',
        id: mockId,
        declareMock: declareMockSpy,
    })

    mockDefinitionRepositoryStub.getById.returns(mockDefinition)
    scopeRepositoryStub.getByName.returns(scope)

    mockManager.activateMock(mockId)

    t.true(mockDefinitionRepositoryStub.getById.calledOnceWithExactly(mockId))
    t.true(scopeRepositoryStub.getByName.calledOnceWithExactly('foo'))
    t.true(declareMockSpy.calledOnceWithExactly(scope))
})

test.serial(
    'mockManager.activateMock should not add an unknown definition kind',
    ({ context: { mockDefinitionRepositoryStub, scopeRepositoryStub, mockManager }, ...t }) => {
        const mockId = '06ad0ae8-bffb-4753-8cf0-ab540da6281f'

        const scope = getFakeScope()

        const declareMockSpy = mock().returnsThis()

        const mockDefinition = getMockDefinition({
            kind: 'unknown' as 'js',
            id: mockId,
            declareMock: declareMockSpy,
        })

        mockDefinitionRepositoryStub.getById.returns(mockDefinition)
        scopeRepositoryStub.getByName.returns(scope)

        mockManager.activateMock(mockId)

        t.true(mockDefinitionRepositoryStub.getById.calledOnceWithExactly(mockId))
        t.true(declareMockSpy.notCalled)
    }
)

test.serial(
    'mockManager.activateMock should not add an undefined definition',
    ({ context: { mockDefinitionRepositoryStub, scopeRepositoryStub, mockManager }, ...t }) => {
        const mockId = '06ad0ae8-bffb-4753-8cf0-ab540da6281f'

        mockDefinitionRepositoryStub.getById.returns(undefined)

        mockManager.activateMock(mockId)

        t.true(mockDefinitionRepositoryStub.getById.calledOnceWithExactly(mockId))
        t.true(scopeRepositoryStub.getByName.notCalled)
    }
)

test('mockManager.activateMocksGroup should activate all definitions', ({
    context: { mockDefinitionRepositoryStub, scopeRepositoryStub, mockManager },
    ...t
}) => {
    const mockGroupId = '6658ddcd-5041-40e8-8a7e-7344c4d19e1e'

    const scopeA = getFakeScope('fake-scope-a')
    const declareMockASpy = mock().returnsThis()
    const serviceNameA = 'a'

    const mockDefinitionA: JavaScriptMockDefinition = getMockDefinition({
        groupId: mockGroupId,
        serviceName: serviceNameA,
        declareMock: declareMockASpy,
    })

    const scopeB = getFakeScope('fake-scope-b')
    const declareMockBSpy = mock().returnsThis()
    const serviceNameB = 'b'

    const mockDefinitionB: JavaScriptMockDefinition = getMockDefinition({
        groupId: mockGroupId,
        serviceName: serviceNameB,
        declareMock: declareMockBSpy,
    })

    mockDefinitionRepositoryStub.getByGroupId.returns([mockDefinitionA, mockDefinitionB])
    scopeRepositoryStub.getByName.withArgs(serviceNameA).returns(scopeA).withArgs(serviceNameB).returns(scopeB)

    mockManager.activateMocksGroup(mockGroupId)

    t.true(mockDefinitionRepositoryStub.getByGroupId.calledOnceWithExactly(mockGroupId))
    t.true(scopeRepositoryStub.getByName.calledWithExactly(serviceNameA))
    t.true(scopeRepositoryStub.getByName.calledWithExactly(serviceNameB))
    t.true(declareMockASpy.calledOnceWithExactly(scopeA))
    t.true(declareMockBSpy.calledOnceWithExactly(scopeB))
})

test.serial(
    'mockManager.activateMocksGroup should not add an unknown definition kind',
    ({ context: { mockDefinitionRepositoryStub, scopeRepositoryStub, mockManager }, ...t }) => {
        const mockGroupId = '6658ddcd-5041-40e8-8a7e-7344c4d19e1e'

        const scopeA = getFakeScope('fake-scope-a')
        const declareMockASpy = mock().returnsThis()
        const serviceNameA = 'a'

        const mockDefinitionA: JavaScriptMockDefinition = getMockDefinition({
            kind: 'js',
            id: '06ad0ae8-bffb-4753-8cf0-ab540da6281f',
            groupId: mockGroupId,
            serviceName: serviceNameA,
            declareMock: declareMockASpy,
        })

        const scopeB = getFakeScope('fake-scope-b')
        const declareMockBSpy = mock().returnsThis()
        const serviceNameB = 'b'

        const mockDefinitionB = ({
            kind: 'unknown',
            id: '2bc303ed-5ba0-4ba5-bc64-285a6401b02f',
            groupId: mockGroupId,
            serviceName: serviceNameB,
            declareMock: declareMockBSpy,
        } as unknown) as MockDefinition

        mockDefinitionRepositoryStub.getByGroupId.returns([mockDefinitionA, mockDefinitionB])
        scopeRepositoryStub.getByName.onFirstCall().returns(scopeA).onSecondCall().returns(scopeB)

        mockManager.activateMocksGroup(mockGroupId)

        t.true(mockDefinitionRepositoryStub.getByGroupId.calledOnceWithExactly(mockGroupId))
        t.true(declareMockASpy.calledOnce)
        t.true(declareMockBSpy.notCalled)
    }
)

test('mockManager.listActiveMocks should return active mocks', ({
    context: { activeMocksStub, mockManager },
    ...t
}) => {
    const expectedActiveMocks = ['mock-a', 'mock-b']

    activeMocksStub.returns(expectedActiveMocks)

    const activeMocks = mockManager.listActiveMocks()

    t.deepEqual(activeMocks, expectedActiveMocks)
})

test('mockManager.listPendingMocks should return pending mocks', ({
    context: { pendingMocksStub, mockManager },
    ...t
}) => {
    const expectedPendingMocks = ['mock-a', 'mock-b']

    pendingMocksStub.returns(expectedPendingMocks)

    const pendingMocks = mockManager.listPendingMocks()

    t.deepEqual(pendingMocks, expectedPendingMocks)
})

test('mockManager.checkNoPendingMocks should throw when mocks are pending', ({
    context: { pendingMocksStub, mockManager },
    ...t
}) => {
    const expectedPendingMocks = ['mock-a', 'mock-b']

    pendingMocksStub.returns(expectedPendingMocks)

    const expectedMessage = `At least a mock is still pending: \n - mock-a\n - mock-b`

    t.throws(() => mockManager.checkNoPendingMocks(), {
        instanceOf: TechnicalError,
        code: ErrorCode.MocksStillPending,
        message: expectedMessage,
    })
})

test('mockManager.checkNoPendingMocks should not throw when there is no pending mock', ({
    context: { pendingMocksStub, mockManager },
    ...t
}) => {
    const expectedPendingMocks: string[] = []

    pendingMocksStub.returns(expectedPendingMocks)

    t.notThrows(() => mockManager.checkNoPendingMocks())
})

test('mockManager.resetMocks should clean all pending mocks', ({ context: { cleanAllStub, mockManager }, ...t }) => {
    mockManager.resetMocks()

    t.true(cleanAllStub.calledOnce)
})
