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

    private addMockToRepository = (definition?: MockDefinition): void => {
        if (definition?.kind === 'js') {
            this.scopeRepository.add(definition.declareMock())
        }
    }

    activateMock(id: string): void {
        this.addMockToRepository(this.mockDefinitionRepository.getById(id))
    }

    activateMocksGroup(groupId: string): void {
        this.mockDefinitionRepository.getByGroupId(groupId).forEach(this.addMockToRepository)
    }

    listActiveMocks(): string[] {
        return this.scopeRepository.getActiveMocks()
    }

    listPendingMocks(): string[] {
        return this.scopeRepository.getPendingMocks()
    }

    checkNoPendingMocks(): void {
        const pendingMocks = this.scopeRepository.getPendingMocks()
        if (pendingMocks.length > 0) {
            throw new TechnicalError(
                ErrorCode.MocksStillPending,
                `At least a mock is still pending: \n${pendingMocks.map((it) => ` - ${it}`).join('\n')}`
            )
        }
    }
}
