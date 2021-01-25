import nock from 'nock'

import { TechnicalError } from '../error'
import { ErrorCode } from '../error/definitions'
import { MockDefinition } from './loader'
import { MockDefinitionRepository } from './mockDefinitionRepository'
import { ScopeRepository } from './scopeRepository'

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

    activateMock(id: string): void {
        this.declareMock(this.mockDefinitionRepository.getById(id))
    }

    activateMocksGroup(groupId: string): void {
        this.mockDefinitionRepository.getByGroupId(groupId).forEach(this.declareMock)
    }

    listActiveMocks(): string[] {
        return nock.activeMocks()
    }

    listPendingMocks(): string[] {
        return nock.pendingMocks()
    }

    checkNoPendingMocks(): void {
        const pendingMocks = nock.pendingMocks()
        if (pendingMocks.length > 0) {
            throw new TechnicalError(
                ErrorCode.MocksStillPending,
                `At least a mock is still pending: \n${pendingMocks.map((it) => ` - ${it}`).join('\n')}`
            )
        }
    }

    resetMocks(): void {
        nock.cleanAll()
    }
}
