import test from 'ava'
import path from 'path'

import { TechnicalError } from '../../../../lib/error'
import { ErrorCode } from '../../../../lib/error/definitions'
import { JavaScriptMockLoader, validateMockDefinitionOrThrow } from '../../../../lib/mock/loader/jsMockLoader'

test('JavaScriptMockLoader.name should be correct', (t) => {
    const expectedName = 'JavaScriptMockLoader'

    t.deepEqual(JavaScriptMockLoader.name, expectedName)
})

test('JavaScriptMockLoader.accept should return true when the path ends with .js', (t) => {
    const filePath = '/foo/bar.js'

    t.true(JavaScriptMockLoader.accept(filePath))
})

test('JavaScriptMockLoader.load should return the loaded module', async (t) => {
    const filePath = path.join(__dirname, '_data/valid.js')

    const expectedMockDefinition = {
        id: '6f255e81-4331-4cdb-a248-f6ffdefe332c',
        kind: 'js',
    }

    const mockDefinition = await JavaScriptMockLoader.load(filePath)

    t.like(mockDefinition, expectedMockDefinition)
})

test('JavaScriptMockLoader.load should throw when the module is invalid', async (t) => {
    const filePath = path.join(__dirname, '_data/invalid.js')

    await t.throwsAsync<TechnicalError>(() => JavaScriptMockLoader.load(filePath), {
        instanceOf: TechnicalError,
        code: ErrorCode.InvalidMockDefinition,
    })
})

test('JavaScriptMockLoader.load should throw when the module is not found', async (t) => {
    const filePath = path.join(__dirname, '_data/not-found.js')

    await t.throwsAsync<TechnicalError>(() => JavaScriptMockLoader.load(filePath), {
        instanceOf: TechnicalError,
        code: ErrorCode.InvalidMockDefinition,
        message: 'The import failed',
    })
})

test('validateMockDefinitionOrThrow should not throw given a valid input', (t) => {
    const input = {
        declareMock: () => true,
    }

    t.notThrows(() => validateMockDefinitionOrThrow(input))
})

test('validateMockDefinitionOrThrow should throw when it is not an object', (t) => {
    const input = () => true

    t.throws<TechnicalError>(() => validateMockDefinitionOrThrow(input), {
        instanceOf: TechnicalError,
        code: ErrorCode.InvalidMockDefinition,
        message: 'The mock definition should be an object',
    })
})

test('validateMockDefinitionOrThrow should throw when the object does not have a function named mock', (t) => {
    const input = {}

    t.throws<TechnicalError>(() => validateMockDefinitionOrThrow(input), {
        instanceOf: TechnicalError,
        code: ErrorCode.InvalidMockDefinition,
        message: "The mock definition should have 'mock' function",
    })
})
