import nock, { Scope } from 'nock'

import { TechnicalError } from '../error'
import { ErrorCode } from '../error/definitions'
import { getServiceBaseUrl, Service } from '../option'

export class ScopeRepository {
    private readonly scopesByName = new Map<string, Scope>()

    constructor(services: Service[]) {
        services.forEach((it) => this.scopesByName.set(it.name, nock(getServiceBaseUrl(it))))
    }

    getByName(name: string): Scope {
        const scope = this.scopesByName.get(name)
        if (scope) return scope

        throw new TechnicalError(ErrorCode.MissingScope, `Missing scope for '${name}'`)
    }
}
