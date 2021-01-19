import { MockDefinitionLoader } from './definitions'
import { JavaScriptMockLoader } from './jsMockLoader'

const mockDefinitionLoaders = [JavaScriptMockLoader]

export const getMockDefinitionLoaders = (): MockDefinitionLoader[] => mockDefinitionLoaders

export * from './definitions'
