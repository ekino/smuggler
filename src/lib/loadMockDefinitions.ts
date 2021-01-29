import { listAvailableMocks } from './mock'
import { getMockDefinitionLoaders, MockDefinition, MockDefinitionLoader } from './mock/loader'
import { Options } from './option'
import { isDefined } from './utils/type'

export const loadMockDefinitions = (options: Options): Promise<MockDefinition[]> => {
    const mockDefinitionLoaders = getMockDefinitionLoaders()
    return Promise.all(listAvailableMocks(options).map((it) => toMockDefinition(it, mockDefinitionLoaders))).then(
        (results) => {
            const definitions = results.filter(isDefined)
            console.debug(`${results.length} mock(s) loaded.`)
            return definitions
        }
    )
}

const toMockDefinition = async (
    mockDefinitionPath: string,
    mockDefinitionLoaders: MockDefinitionLoader[]
): Promise<MockDefinition | undefined> =>
    mockDefinitionLoaders
        .find((it) => it.accept(mockDefinitionPath))
        ?.load(mockDefinitionPath)
        ?.catch((error) => {
            console.error(`Failed to load definition '${mockDefinitionPath}'`, error)
            return undefined
        })
