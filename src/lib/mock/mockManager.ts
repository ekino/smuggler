import nock from 'nock'

import { TechnicalError } from '../error'
import { ErrorCode } from '../error/definitions'
import { MockDefinition } from './loader'
import { MockDefinitionRepository } from './mockDefinitionRepository'

export class MockManager {
    private readonly mockDefinitionRepository: MockDefinitionRepository

    constructor(mockDefinitionRepository: MockDefinitionRepository) {
        this.mockDefinitionRepository = mockDefinitionRepository
    }

    private addMockToRepository = (definition?: MockDefinition): void => {
        if (definition?.kind === 'js') {
            definition.declareMock()
        }
    }

    activateMock(id: string): void {
        this.addMockToRepository(this.mockDefinitionRepository.getById(id))
    }

    activateMocksGroup(groupId: string): void {
        this.mockDefinitionRepository.getByGroupId(groupId).forEach(this.addMockToRepository)
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
