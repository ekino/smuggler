import test from 'ava'

import { getOptions, Options, UserDefinedOptions } from '../../../lib/option'

test('getOptions should return default values when no options are defined', (t) => {
    const givenUserOptions = {}

    const expectedOptions: Options = {
        baseDirectory: './',
        mocksDirectory: '__mocks__',
        allowedExtensions: ['js'],
    }

    const options = getOptions(givenUserOptions)

    t.deepEqual(options, expectedOptions)
})

test('getOptions should return default values when given options are undefined', (t) => {
    const expectedOptions: Options = {
        baseDirectory: './',
        mocksDirectory: '__mocks__',
        allowedExtensions: ['js'],
    }

    const options = getOptions()

    t.deepEqual(options, expectedOptions)
})

test('getOptions should return user defined values', (t) => {
    const givenUserDefinedOptions: UserDefinedOptions = {
        baseDirectory: './foo',
        mocksDirectory: 'mocks-dir',
        allowedExtensions: ['ts'],
    }

    const expectedOptions: Options = {
        baseDirectory: './foo',
        mocksDirectory: 'mocks-dir',
        allowedExtensions: ['ts'],
    }

    const options = getOptions(givenUserDefinedOptions)

    t.deepEqual(options, expectedOptions)
})
