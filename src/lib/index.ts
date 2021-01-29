import { loadMockDefinitions } from './loadMockDefinitions'
import { MockDefinitionRepository, MockManager } from './mock'
import { ScopeRepository } from './mock/scopeRepository'
import { getOptions, UserDefinedOptions } from './option'

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
