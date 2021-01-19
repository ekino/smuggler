import avaTest, { TestInterface } from 'ava'
import { createStubInstance, mock, SinonStubbedInstance } from 'sinon'

import { TechnicalError } from '../../../lib/error'
import { ErrorCode } from '../../../lib/error/definitions'
import { MockDefinitionRepository, MockManager, ScopeRepository } from '../../../lib/mock'
import { JavaScriptMockDefinition, MockDefinition } from '../../../lib/mock/loader'
import { getFakeScope, getMockDefinition } from '../../_utils/data'

type TestContext = {
    scopeRepositoryStub: SinonStubbedInstance<ScopeRepository>
    mockDefinitionRepositoryStub: SinonStubbedInstance<MockDefinitionRepository>
    mockManager: MockManager
}

const test = avaTest as TestInterface<TestContext>

test.before((t) => {
    t.context.mockDefinitionRepositoryStub = createStubInstance<MockDefinitionRepository>(MockDefinitionRepository)
    t.context.scopeRepositoryStub = createStubInstance<ScopeRepository>(ScopeRepository)

    t.context.mockManager = new MockManager(
        (t.context.mockDefinitionRepositoryStub as unknown) as MockDefinitionRepository,
        (t.context.scopeRepositoryStub as unknown) as ScopeRepository
    )
})

test.beforeEach((t) => {
    t.context.mockDefinitionRepositoryStub.getById.reset()
    t.context.mockDefinitionRepositoryStub.getByGroupId.reset()
    t.context.scopeRepositoryStub.add.reset()
    t.context.scopeRepositoryStub.clear.reset()
    t.context.scopeRepositoryStub.getPendingMocks.reset()
    t.context.scopeRepositoryStub.getActiveMocks.reset()
})

test('mockManager.activateMock should find a definition, create the scope then add it', (t) => {
    const mockId = '06ad0ae8-bffb-4753-8cf0-ab540da6281f'

    const scope = getFakeScope()

    const declareMockSpy = mock().returns(scope)

    const mockDefinition: JavaScriptMockDefinition = {
        kind: 'js',
        id: mockId,
        declareMock: declareMockSpy,
    }

    t.context.mockDefinitionRepositoryStub.getById.returns(mockDefinition)

    t.context.scopeRepositoryStub.add.returns()

    t.context.mockManager.activateMock(mockId)

    t.true(t.context.mockDefinitionRepositoryStub.getById.calledOnceWithExactly(mockId))

    t.true(t.context.scopeRepositoryStub.add.calledOnceWithExactly(scope))
})

test.serial('mockManager.activateMock should not add an unknown definition kind', (t) => {
    const mockId = '06ad0ae8-bffb-4753-8cf0-ab540da6281f'

    const scope = getFakeScope()

    const declareMockSpy = mock().returns(scope)

    const mockDefinition = getMockDefinition({
        kind: 'unknown' as 'js',
        id: mockId,
        declareMock: declareMockSpy,
    })

    t.context.mockDefinitionRepositoryStub.getById.returns(mockDefinition)

    t.context.mockManager.activateMock(mockId)

    t.true(t.context.mockDefinitionRepositoryStub.getById.calledOnceWithExactly(mockId))

    t.false(t.context.scopeRepositoryStub.add.called)
})

test('mockManager.activateMocksGroup should find a definition, create the scope then add it', (t) => {
    const mockGroupId = '6658ddcd-5041-40e8-8a7e-7344c4d19e1e'

    const scopeA = getFakeScope('fake-scope-a')
    const scopeB = getFakeScope('fake-scope-b')

    const mockDefinitionA: JavaScriptMockDefinition = getMockDefinition({
        id: '06ad0ae8-bffb-4753-8cf0-ab540da6281f',
        groupId: mockGroupId,
        declareMock: mock().returns(scopeA),
    })

    const mockDefinitionB: JavaScriptMockDefinition = getMockDefinition({
        id: '2bc303ed-5ba0-4ba5-bc64-285a6401b02f',
        groupId: mockGroupId,
        declareMock: mock().returns(scopeB),
    })

    t.context.mockDefinitionRepositoryStub.getByGroupId.returns([mockDefinitionA, mockDefinitionB])

    t.context.scopeRepositoryStub.add.returns()

    t.context.mockManager.activateMocksGroup(mockGroupId)

    t.true(t.context.mockDefinitionRepositoryStub.getByGroupId.calledOnceWithExactly(mockGroupId))

    t.true(t.context.scopeRepositoryStub.add.calledWithExactly(scopeA))
    t.true(t.context.scopeRepositoryStub.add.calledWithExactly(scopeB))
})

test.serial('mockManager.activateMocksGroup should not add an unknown definition kind', (t) => {
    const mockGroupId = '6658ddcd-5041-40e8-8a7e-7344c4d19e1e'

    const scopeA = getFakeScope('fake-scope-a')
    const scopeB = getFakeScope('fake-scope-b')

    const mockDefinitionA: JavaScriptMockDefinition = {
        kind: 'js',
        id: '06ad0ae8-bffb-4753-8cf0-ab540da6281f',
        groupId: mockGroupId,
        declareMock: mock().returns(scopeA),
    }

    const mockDefinitionB = ({
        kind: 'unknown',
        id: '2bc303ed-5ba0-4ba5-bc64-285a6401b02f',
        groupId: mockGroupId,
        declareMock: mock().returns(scopeB),
    } as unknown) as MockDefinition

    t.context.mockDefinitionRepositoryStub.getByGroupId.returns([mockDefinitionA, mockDefinitionB])

    t.context.scopeRepositoryStub.add.returns()

    t.context.mockManager.activateMocksGroup(mockGroupId)

    t.true(t.context.mockDefinitionRepositoryStub.getByGroupId.calledOnceWithExactly(mockGroupId))

    t.true(t.context.scopeRepositoryStub.add.calledOnceWithExactly(scopeA))
})

test('mockManager.listActiveMocks should return active mocks', (t) => {
    const expectedActiveMocks = ['mock-a', 'mock-b']

    t.context.scopeRepositoryStub.getActiveMocks.returns(expectedActiveMocks)

    const activeMocks = t.context.mockManager.listActiveMocks()

    t.deepEqual(activeMocks, expectedActiveMocks)
})

test('mockManager.listPendingMocks should return pending mocks', (t) => {
    const expectedPendingMocks = ['mock-a', 'mock-b']

    t.context.scopeRepositoryStub.getPendingMocks.returns(expectedPendingMocks)

    const pendingMocks = t.context.mockManager.listPendingMocks()

    t.deepEqual(pendingMocks, expectedPendingMocks)
})

test('mockManager.checkNoPendingMocks should throw when mocks are pending', (t) => {
    const expectedPendingMocks = ['mock-a', 'mock-b']

    t.context.scopeRepositoryStub.getPendingMocks.returns(expectedPendingMocks)

    const expectedMessage = `At least a mock is still pending: \n - mock-a\n - mock-b`

    t.throws(() => t.context.mockManager.checkNoPendingMocks(), {
        instanceOf: TechnicalError,
        code: ErrorCode.MocksStillPending,
        message: expectedMessage,
    })
})

test('mockManager.checkNoPendingMocks should not throw when there is no pending mock', (t) => {
    const expectedPendingMocks: string[] = []

    t.context.scopeRepositoryStub.getPendingMocks.returns(expectedPendingMocks)

    t.notThrows(() => t.context.mockManager.checkNoPendingMocks())
})
