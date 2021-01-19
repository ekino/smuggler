import { MockDefinition } from './loader'

export class MockDefinitionRepository {
    private readonly mockDefinitions: MockDefinition[]

    constructor(mockDefinitions: MockDefinition[]) {
        this.mockDefinitions = [...mockDefinitions]
    }

    getById(id: string): MockDefinition | undefined {
        return this.mockDefinitions.find((it) => it.id === id)
    }

    getByGroupId(groupId: string): MockDefinition[] {
        return this.mockDefinitions.filter((it) => it.groupId === groupId)
    }
}
