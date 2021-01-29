import avaTest, { TestInterface } from 'ava'
import { SinonStub, stub } from 'sinon'

import { initialize } from '../../lib'
import * as mockLoader from '../../lib/loadMockDefinitions'
import { UserDefinedOptions } from '../../lib/option'
import { getMockDefinition, getOptions, getService } from '../_utils/data'

type TestContext = {
    loadMockDefinitionsStub: SinonStub
}

const test = avaTest as TestInterface<TestContext>

test.before((t) => {
    t.context.loadMockDefinitionsStub = stub(mockLoader, 'loadMockDefinitions')
})

test.afterEach((t) => {
    t.context.loadMockDefinitionsStub.reset()
})

test.after((t) => {
    t.context.loadMockDefinitionsStub.restore()
})

test('initialize should return a MockManager', async ({ context: { loadMockDefinitionsStub }, ...t }) => {
    const userDefinedOptions: UserDefinedOptions = getOptions({
        services: [getService({ name: 'service-a' }), getService({ name: 'service-b' })],
    })

    const mockDefinitions = [getMockDefinition({ id: 'mock-a' }), getMockDefinition({ id: 'mock-b' })]
    loadMockDefinitionsStub.resolves(mockDefinitions)

    const mockManager = await initialize(userDefinedOptions)

    t.truthy(mockManager['mockDefinitionRepository'])
    t.deepEqual(mockManager['mockDefinitionRepository']['mockDefinitions'], mockDefinitions)

    const scopesByName = mockManager['scopeRepository']['scopesByName']
    t.truthy(scopesByName)
    t.true(scopesByName.has('service-a'))
    t.true(scopesByName.has('service-b'))
})
