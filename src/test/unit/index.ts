import avaTest, { TestInterface } from 'ava'
import { SinonStub, stub } from 'sinon'

import { initialize } from '../../lib'
import * as mockUtils from '../../lib/mock/listAvailableMocks'
import * as mockLoader from '../../lib/mock/loader'
import { UserDefinedOptions } from '../../lib/option'
import { getMockDefinition } from '../_utils/data'

type TestContext = {
    mockDefinitionLoaderStub: mockLoader.MockDefinitionLoader
    listAvailableMocksStub: SinonStub
    getMockDefinitionLoadersStub: SinonStub
}

const test = avaTest as TestInterface<TestContext>

test.before((t) => {
    t.context.mockDefinitionLoaderStub = {
        name: 'StubbedMockDefinitionLoader',
        accept: stub(),
        load: stub(),
    }

    t.context.listAvailableMocksStub = stub(mockUtils, 'listAvailableMocks')
    t.context.getMockDefinitionLoadersStub = stub(mockLoader, 'getMockDefinitionLoaders').returns([
        t.context.mockDefinitionLoaderStub,
    ])
})

const definitionOne = getMockDefinition({ id: 'good' })
const definitionTwo = getMockDefinition({ id: 'ok' })

test.beforeEach((t) => {
    const goodMock = 'mock.good'
    const okMock = 'mock.ok'
    const badMock = 'mock.bad'

    t.context.listAvailableMocksStub.returns([goodMock, okMock, badMock])

    const acceptStub = t.context.mockDefinitionLoaderStub.accept as SinonStub
    acceptStub.withArgs(goodMock).returns(true)
    acceptStub.withArgs(okMock).returns(true)
    acceptStub.withArgs(badMock).returns(false)

    const loadStub = t.context.mockDefinitionLoaderStub.load as SinonStub
    loadStub.onFirstCall().returns(definitionOne).onSecondCall().returns(definitionTwo)
})

test.afterEach((t) => {
    const acceptStub = t.context.mockDefinitionLoaderStub.accept as SinonStub
    acceptStub.reset()

    const loadStub = t.context.mockDefinitionLoaderStub.load as SinonStub
    loadStub.reset()

    t.context.listAvailableMocksStub.reset()
})

test.after((t) => {
    t.context.listAvailableMocksStub.restore()
    t.context.getMockDefinitionLoadersStub.restore()
})

test('initialize should return a MockManager', async (t) => {
    const userDefinedOptions: UserDefinedOptions = {
        allowedExtensions: ['js'],
    }

    const mockManager = await initialize(userDefinedOptions)

    t.truthy(mockManager['mockDefinitionRepository'])
    t.deepEqual(mockManager['mockDefinitionRepository']['mockDefinitions'], [definitionOne, definitionTwo])

    t.truthy(mockManager['scopeRepository'])
})
