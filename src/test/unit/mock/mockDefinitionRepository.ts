import avaTest, { TestInterface } from 'ava'

import { MockDefinitionRepository } from '../../../lib/mock'
import { JavaScriptMockDefinition } from '../../../lib/mock/loader'

type TestContext = {
    repository: MockDefinitionRepository
}

const test = avaTest as TestInterface<TestContext>

const mockA = {
    id: 'mock-a',
    groupId: 'mock-group-a',
} as JavaScriptMockDefinition

const mockB = {
    id: 'mock-b',
} as JavaScriptMockDefinition

const mockC = {
    id: 'mock-c',
    groupId: 'mock-group-a',
} as JavaScriptMockDefinition

test.before((t) => {
    t.context.repository = new MockDefinitionRepository([mockA, mockB, mockC])
})

test('getById should return a mock definition for the given id', (t) => {
    const mockDefinition = t.context.repository.getById('mock-a')

    t.deepEqual(mockDefinition, mockA)
})

test('getById should return undefined when there is no definition for the given id', (t) => {
    const mockDefinition = t.context.repository.getById('mock-d')

    t.true(mockDefinition === undefined)
})

test('getByGroupId should return all elements for a given group id', (t) => {
    const mockDefinition = t.context.repository.getByGroupId('mock-group-a')

    const expectedMockDefinitions = [mockA, mockC]

    t.deepEqual(mockDefinition, expectedMockDefinitions)
})

test('getByGroupId should return an empty array when there is no definition for the given group id', (t) => {
    const mockDefinition = t.context.repository.getByGroupId('mock-group-b')

    t.deepEqual(mockDefinition, [])
})
