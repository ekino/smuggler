import test from 'ava'

import { getMockDefinitionLoaders } from '../../../../lib/mock/loader'

test('mockDefinitionLoaders should contain one loader', (t) => {
    const mockDefinitionLoaders = getMockDefinitionLoaders()

    t.is(mockDefinitionLoaders.length, 1)
})

test('mockDefinitionLoaders should contain the JavaScriptMockLoader', (t) => {
    const mockDefinitionLoaders = getMockDefinitionLoaders()

    t.truthy(mockDefinitionLoaders.find((it) => it.name === 'JavaScriptMockLoader'))
})
