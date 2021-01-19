import avaTest, { TestInterface } from 'ava'

import { ScopeRepository } from '../../../lib/mock'
import { getFakeScope } from '../../_utils/data'

type TestContext = {
    repository: ScopeRepository
}

const test = avaTest as TestInterface<TestContext>

test.beforeEach((t) => {
    t.context.repository = new ScopeRepository()
})

test('scopeRepository.add should add a scope to its array', (t) => {
    const scope = getFakeScope()

    t.context.repository.add(scope)

    t.is(t.context.repository['scopes'].length, 1)
})

test('scopeRepository.clear should remove all scopes', (t) => {
    const scopeA = getFakeScope('fake-scope-a')
    const scopeB = getFakeScope('fake-scope-b')

    t.context.repository['scopes'].push(scopeA, scopeB)

    t.context.repository.clear()

    t.is(t.context.repository['scopes'].length, 0)
})

test('scopeRepository.getPendingMocks should return all pending mocks', (t) => {
    const scopeA = getFakeScope('fake-scope-a', {
        pendingMocks: () => ['scopeA:mock-1', 'scopeA:mock-2'],
    })

    const scopeB = getFakeScope('fake-scope-b', {
        pendingMocks: () => [],
    })

    const scopeC = getFakeScope('fake-scope-c', {
        pendingMocks: () => ['scopeC:mock-1'],
    })

    t.context.repository['scopes'].push(scopeA, scopeB, scopeC)

    const expectedPendingMocks = ['scopeA:mock-1', 'scopeA:mock-2', 'scopeC:mock-1']

    const pendingMocks = t.context.repository.getPendingMocks()

    t.deepEqual(pendingMocks, expectedPendingMocks)
})

test('scopeRepository.getActiveMocks should return all active mocks', (t) => {
    const scopeA = getFakeScope('fake-scope-a', {
        activeMocks: () => [],
    })

    const scopeB = getFakeScope('fake-scope-b', {
        activeMocks: () => ['scopeB:mock-1'],
    })

    const scopeC = getFakeScope('fake-scope-c', {
        activeMocks: () => ['scopeC:mock-1'],
    })

    t.context.repository['scopes'].push(scopeA, scopeB, scopeC)

    const expectedActiveMocks = ['scopeB:mock-1', 'scopeC:mock-1']

    const activeMocks = t.context.repository.getActiveMocks()

    t.deepEqual(activeMocks, expectedActiveMocks)
})
