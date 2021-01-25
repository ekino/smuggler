import test from 'ava'
import { stub } from 'sinon'

import { TechnicalError } from '../../../lib/error'
import { ErrorCode } from '../../../lib/error/definitions'
import { ScopeRepository } from '../../../lib/mock/scopeRepository'
import * as option from '../../../lib/option'
import { getService } from '../../_utils/data'

const serviceOne = getService({ host: 'foo1.com', name: 'foo1' })
const serviceTwo = getService({ host: 'foo2.com', name: 'foo2' })
const services = [serviceOne, serviceTwo]

const serviceOneUrl = 'http://foo1.com'
const serviceTwoUrl = 'http://foo2.com'

const getServiceBaseUrlStub = stub(option, 'getServiceBaseUrl')

test.after((t) => {
    getServiceBaseUrlStub.restore()
})

test.beforeEach((t) => {
    getServiceBaseUrlStub.reset()

    getServiceBaseUrlStub.withArgs(serviceOne).returns(serviceOneUrl).withArgs(serviceTwo).returns(serviceTwoUrl)
})

test('scopeRepository should create a scope per service', (t) => {
    const scopeRepository = new ScopeRepository(services)

    const scopesByName = scopeRepository['scopesByName']
    t.is(scopesByName.size, 2)

    t.true(scopesByName.has(serviceOne.name))
    t.true(scopesByName.has(serviceTwo.name))
})

test('scopeRepository.getByName should return expected ', (t) => {
    const scopeRepository = new ScopeRepository(services)

    const scope = scopeRepository.getByName(serviceTwo.name)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    t.true(scope['basePath'].startsWith(serviceTwoUrl))
})

test('scopeRepository.getByName should throw when no scope is found', (t) => {
    const scopeRepository = new ScopeRepository(services)

    const expectedMessage = "Missing scope for 'unknown'"

    t.throws(() => scopeRepository.getByName('unknown'), {
        instanceOf: TechnicalError,
        code: ErrorCode.MissingScope,
        message: expectedMessage,
    })
})
