import { listAvailableMocks, MockDefinitionRepository, MockManager } from './mock'
import { getMockDefinitionLoaders, MockDefinition } from './mock/loader'
import { ScopeRepository } from './mock/scopeRepository'
import { getOptions, Options, UserDefinedOptions } from './option'
import { isDefined } from './utils/type'

const loadMockDefinitions = (options: Options): Promise<MockDefinition[]> =>
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

/**
 * Initialize the {@link MockManager} from the given {@code userOptions}.
 *
 * @param {UserDefinedOptions} userOptions - Configuration required to initialize the {@link MockManager}
 *
 * @return {MockManager} - The component to use for interacting with your mock declarations
 */
export const initialize = async (userOptions: UserDefinedOptions): Promise<MockManager> => {
    const options = getOptions(userOptions)

    const mockDefinitions = await loadMockDefinitions(options)

    return new MockManager(new MockDefinitionRepository(mockDefinitions), new ScopeRepository(options.services))
}
