import { Scope } from 'nock'

export class ScopeRepository {
    private readonly scopes: Scope[]

    constructor() {
        this.scopes = []
    }

    add(scope: Scope): void {
        this.scopes.push(scope)
    }

    clear(): void {
        this.scopes.splice(0, this.scopes.length)
    }

    getPendingMocks(): string[] {
        return this.scopes.reduce((pendingMocks, scope) => {
            return scope.pendingMocks().length > 0 ? pendingMocks.concat(scope.pendingMocks()) : pendingMocks
        }, [] as string[])
    }

    getActiveMocks(): string[] {
        return this.scopes.reduce((activeMocks, scope) => {
            return scope.activeMocks().length > 0 ? activeMocks.concat(scope.activeMocks()) : activeMocks
        }, [] as string[])
    }
}
