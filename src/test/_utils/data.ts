import { Scope } from 'nock'

import { MockDefinition } from '../../lib/mock/loader'
import { Options } from '../../lib/option'

export const getOptions = (options?: Partial<Options>): Options => ({
    allowedExtensions: options?.allowedExtensions || ['mock'],
    baseDirectory: options?.baseDirectory || 'test',
    mocksDirectory: options?.mocksDirectory || 'test-mock',
})

export const getMockDefinition = (mockDefinition?: Partial<MockDefinition>): MockDefinition => ({
    kind: mockDefinition?.kind || 'js',
    id: mockDefinition?.id || '80d3c82a-a663-4a46-a617-d8890fc8933e',
    groupId: mockDefinition?.groupId || '290200e0-f52a-426f-8d26-7196c991c429',
    declareMock: mockDefinition?.declareMock || (((() => 'mocked') as unknown) as () => Scope),
})

export const getFakeScope = (name = 'fake-scope', scope?: Partial<Scope>): Scope =>
    (({
        ...scope,
        name,
    } as unknown) as Scope)
