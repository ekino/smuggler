import { TechnicalError } from '../../error'
import { ErrorCode } from '../../error/definitions'
import { hasFunction, isObject } from '../../utils/type'
import { MockDefinitionLoader } from './definitions'
import { JavaScriptMockDefinition } from './definitions'

export const JavaScriptMockLoader: MockDefinitionLoader = {
    name: 'JavaScriptMockLoader',
    accept(absoluteFilePath: string): boolean {
        return absoluteFilePath.endsWith('.js')
    },
    async load(absoluteFilePath: string): Promise<JavaScriptMockDefinition> {
        return import(absoluteFilePath)
            .catch((error) => {
                throw new TechnicalError(ErrorCode.InvalidMockDefinition, 'The import failed', error)
            })
            .then((definition) => {
                validateMockDefinitionOrThrow(definition)

                return {
                    kind: 'js',
                    ...definition,
                }
            })
    },
}

export const validateMockDefinitionOrThrow = (definition: unknown): void => {
    if (!isObject(definition))
        throw new TechnicalError(ErrorCode.InvalidMockDefinition, 'The mock definition should be an object')
    if (!hasFunction(definition as Record<string, unknown>, 'declareMock'))
        throw new TechnicalError(ErrorCode.InvalidMockDefinition, "The mock definition should have 'mock' function")
}
