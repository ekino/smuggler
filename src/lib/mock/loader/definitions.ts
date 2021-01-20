export interface MockDefinitionLoader {
    name: string
    accept: (absoluteFilePath: string) => boolean
    load: (absoluteFilePath: string) => Promise<MockDefinition>
}

export type MockDefinition = JavaScriptMockDefinition

export type BaseMockDefinition<TKind extends string> = {
    kind: TKind
    id: string
    groupId?: string
}

export type JavaScriptMockDefinition = BaseMockDefinition<'js'> & {
    declareMock: () => void
}
