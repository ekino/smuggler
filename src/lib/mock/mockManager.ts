import nock from 'nock'

import { TechnicalError } from '../error'
import { ErrorCode } from '../error/definitions'
import { MockDefinition } from './loader'
import { MockDefinitionRepository } from './mockDefinitionRepository'
import { ScopeRepository } from './scopeRepository'

/**
 * A simple manager to ease the handling of mocks through {@link nock}.
 *
 * @see nock
 */
export class MockManager {
    private readonly mockDefinitionRepository: MockDefinitionRepository
    private readonly scopeRepository: ScopeRepository

    constructor(mockDefinitionRepository: MockDefinitionRepository, scopeRepository: ScopeRepository) {
        this.mockDefinitionRepository = mockDefinitionRepository
        this.scopeRepository = scopeRepository
    }

    private declareMock = (definition?: MockDefinition): void => {
        if (definition) {
            const scope = this.scopeRepository.getByName(definition?.serviceName)
            if (definition.kind === 'js') {
                definition.declareMock(scope)
            }
        }
    }

    /**
     * Activate a mock with the given {@code id} (if found).
     *
     * @param {string} id - The id of the mock
     *
     * @see mockDefinitionRepository#getById
     */
    activateMock(id: string): void {
        this.declareMock(this.mockDefinitionRepository.getById(id))
    }

    /**
     * Activate all mocks with the given {@code groupId}.
     *
     * @param {string} groupId - The group's id of the mocks
     *
     * @see mockDefinitionRepository#getByGroupId
     */
    activateMocksGroup(groupId: string): void {
        this.mockDefinitionRepository.getByGroupId(groupId).forEach(this.declareMock)
    }

    /**
     * List all currently active mocks.
     *
     * @returns {string[]} - The list of each active mocks
     *
     * @see nock#activeMocks
     */
    listActiveMocks(): string[] {
        return nock.activeMocks()
    }

    /**
     * List all currently pending mocks.
     *
     * @returns {string[]} - The list of each pending mocks
     *
     * @see nock#pendingMocks
     */
    listPendingMocks(): string[] {
        return nock.pendingMocks()
    }

    /**
     * Throw an error if and only if there's at least one pending mock.
     * The error's description contains the list of all the pending mocks.
     *
     * @see nock#pendingMocks
     *
     * @throws {TechnicalError} - Throws an error with {@link ErrorCode.MocksStillPending} as code.
     */
    checkNoPendingMocks(): void {
        const pendingMocks = nock.pendingMocks()
        if (pendingMocks.length > 0) {
            throw new TechnicalError(
                ErrorCode.MocksStillPending,
                `At least a mock is still pending: \n${pendingMocks.map((it) => ` - ${it}`).join('\n')}`
            )
        }
    }

    /**
     * Reset any declared mock.
     *
     * @see nock#cleanAll
     */
    resetMocks(): void {
        nock.cleanAll()
    }
}
