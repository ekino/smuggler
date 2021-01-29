import avaTest, { TestInterface } from 'ava'
import { SinonStub, SinonStubbedInstance, stub } from 'sinon'

import { loadMockDefinitions } from '../../lib/loadMockDefinitions'
import * as mockUtils from '../../lib/mock/listAvailableMocks'
import * as mockLoader from '../../lib/mock/loader'
import { MockDefinitionLoader } from '../../lib/mock/loader'
import { getMockDefinition, getOptions } from '../_utils/data'

type TestContext = {
    mockDefinitionLoaderStub: SinonStubbedInstance<MockDefinitionLoader>
    listAvailableMocksStub: SinonStub
    getMockDefinitionLoadersStub: SinonStub
}

const test = avaTest as TestInterface<TestContext>

test.before((t) => {
    t.context.mockDefinitionLoaderStub = {
        name: 'FakeMockDefinitionLoader',
        accept: stub(),
        load: stub(),
    }

    t.context.listAvailableMocksStub = stub(mockUtils, 'listAvailableMocks')
    t.context.getMockDefinitionLoadersStub = stub(mockLoader, 'getMockDefinitionLoaders').returns([
        t.context.mockDefinitionLoaderStub,
    ])
})

test.afterEach(({ context: { mockDefinitionLoaderStub, listAvailableMocksStub } }) => {
    mockDefinitionLoaderStub.accept.reset()
    mockDefinitionLoaderStub.load.reset()

    listAvailableMocksStub.reset()
})

test.after(({ context: { getMockDefinitionLoadersStub, listAvailableMocksStub } }) => {
    listAvailableMocksStub.restore()
    getMockDefinitionLoadersStub.restore()
})

const options = getOptions()

test.serial(
    'loadMockDefinitions should only load accepted files',
    async ({ context: { listAvailableMocksStub, mockDefinitionLoaderStub }, ...t }) => {
        const mocks = ['mock-a', 'mock-b']
        listAvailableMocksStub.withArgs(options).returns(mocks)

        mockDefinitionLoaderStub.accept.onFirstCall().returns(false)
        mockDefinitionLoaderStub.accept.onSecondCall().returns(true)

        const mockDefinition = getMockDefinition()
        mockDefinitionLoaderStub.load.resolves(mockDefinition)

        const mockDefinitions = await loadMockDefinitions(options)

        t.is(mockDefinitions.length, 1)
        t.deepEqual(mockDefinitions[0], mockDefinition)

        t.true(mockDefinitionLoaderStub.load.calledOnceWithExactly('mock-b'))
    }
)

test.serial(
    'loadMockDefinitions should not reject when loading failed',
    async ({ context: { listAvailableMocksStub, mockDefinitionLoaderStub }, ...t }) => {
        const mocks = ['mock-a']
        listAvailableMocksStub.withArgs(options).returns(mocks)

        mockDefinitionLoaderStub.accept.returns(true)

        mockDefinitionLoaderStub.load.rejects('ERROR')

        await t.notThrowsAsync(loadMockDefinitions(options))
    }
)

test.serial(
    'loadMockDefinitions should ignore undefined definition',
    async ({ context: { listAvailableMocksStub, mockDefinitionLoaderStub }, ...t }) => {
        const mocks = ['mock-a']
        listAvailableMocksStub.withArgs(options).returns(mocks)

        mockDefinitionLoaderStub.accept.returns(true)

        mockDefinitionLoaderStub.load.resolves(undefined)

        const mockDefinitions = await loadMockDefinitions(options)

        t.is(mockDefinitions.length, 0)
    }
)
