import { listAvailableMocks, MockDefinitionRepository, MockManager } from './mock'
import { getMockDefinitionLoaders, MockDefinition } from './mock/loader'
import { ScopeRepository } from './mock/scopeRepository'
import { getOptions, Options, UserDefinedOptions } from './option'
import { isDefined } from './utils/type'

export const loadMockDefinitions = (options: Options): Promise<MockDefinition[]> =>
    Promise.all(
        listAvailableMocks(options).map((it) =>
            getMockDefinitionLoaders()
                .find((loader) => loader.accept(it))
                ?.load(it)
        )
    )
        .then((results) => results.filter(isDefined))
        .then((results) => {
            console.debug(`${results.length} mock(s) loaded.`)
            return results
        })

export const initialize = async (userOptions: UserDefinedOptions): Promise<MockManager> => {
    const options = getOptions(userOptions)

    const mockDefinitions = await loadMockDefinitions(options)

    return new MockManager(new MockDefinitionRepository(mockDefinitions), new ScopeRepository(options.services))
}
