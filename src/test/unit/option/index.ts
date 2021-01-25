import test from 'ava'

import { TechnicalError } from '../../../lib/error'
import { ErrorCode } from '../../../lib/error/definitions'
import {
    getOptions,
    getServiceBaseUrl,
    Options,
    Service,
    UserDefinedOptions,
    UserDefinedService,
    validateOptions,
} from '../../../lib/option'
import { getService } from '../../_utils/data'

test('getOptions should return default values when no options are defined', (t) => {
    const givenUserOptions: UserDefinedOptions = {
        services: [
            {
                host: 'foo.com',
            },
        ],
    }

    const expectedOptions: Options = {
        baseDirectory: './',
        mocksDirectory: '__mocks__',
        allowedExtensions: ['js'],
        services: [
            {
                name: 'foo.com',
                host: 'foo.com',
                https: false,
            },
        ],
    }

    const options = getOptions(givenUserOptions)

    t.deepEqual(options, expectedOptions)
})

test('getOptions should return user defined values', (t) => {
    const givenUserDefinedOptions: UserDefinedOptions = {
        baseDirectory: './foo',
        mocksDirectory: 'mocks-dir',
        allowedExtensions: ['ts'],
        services: [
            {
                host: 'foo.com',
                name: 'fooBar',
                https: true,
            },
        ],
    }

    const expectedOptions: Options = {
        baseDirectory: './foo',
        mocksDirectory: 'mocks-dir',
        allowedExtensions: ['ts'],
        services: [
            {
                host: 'foo.com',
                name: 'fooBar',
                https: true,
            },
        ],
    }

    const options = getOptions(givenUserDefinedOptions)

    t.deepEqual(options, expectedOptions)
})

test('validateOptions should throw when options are undefined', (t) => {
    t.throws(() => validateOptions(), {
        instanceOf: TechnicalError,
        code: ErrorCode.MissingOption,
        message: 'Options are required',
    })
})

test('validateOptions should throw when the services are undefined', (t) => {
    const options = {} as UserDefinedOptions

    t.throws(() => validateOptions(options), {
        instanceOf: TechnicalError,
        code: ErrorCode.MissingOption,
        message: 'Options is lacking a services configuration',
    })
})

test('validateOptions should throw when the services array is empty', (t) => {
    const options: UserDefinedOptions = {
        services: [],
    }

    t.throws(() => validateOptions(options), {
        instanceOf: TechnicalError,
        code: ErrorCode.MissingOption,
        message: 'Options is lacking a services configuration',
    })
})

test('validateOptions should throw when a service is undefined', (t) => {
    const options: UserDefinedOptions = {
        services: [(undefined as unknown) as UserDefinedService],
    }

    t.throws(() => validateOptions(options), {
        instanceOf: TechnicalError,
        code: ErrorCode.MissingOption,
        message: 'A service should at least have a host',
    })
})

test('validateOptions should throw when a service lacks a host property', (t) => {
    const options: UserDefinedOptions = {
        services: [{} as UserDefinedService],
    }

    t.throws(() => validateOptions(options), {
        instanceOf: TechnicalError,
        code: ErrorCode.MissingOption,
        message: 'A service should at least have a host',
    })
})

test('getServiceBaseUrl should return an HTTP URL', (t) => {
    const service: Service = getService({ https: false })

    const expectedUrl = 'http://foo.com'

    const serviceBaseUrl = getServiceBaseUrl(service)

    t.deepEqual(serviceBaseUrl, expectedUrl)
})

test('getServiceBaseUrl should return an HTTPS URL', (t) => {
    const service: Service = getService({ https: true })

    const expectedUrl = 'https://foo.com'

    const serviceBaseUrl = getServiceBaseUrl(service)

    t.deepEqual(serviceBaseUrl, expectedUrl)
})
