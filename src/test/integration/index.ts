import test from 'ava'
import nock from 'nock'
import path from 'path'

import { initialize } from '../../lib'
import { UserDefinedOptions } from '../../lib/option'

test.afterEach((t) => {
    nock.cleanAll()
})

test.serial('should initialize the mock manager without error', (t) => {
    const userDefinedOptions: UserDefinedOptions = {
        baseDirectory: path.join(__dirname, '_data'),
    }

    t.notThrows(() => initialize(userDefinedOptions))
})

test.serial('should activate expected mock', async (t) => {
    const userDefinedOptions: UserDefinedOptions = {
        baseDirectory: path.join(__dirname, '_data'),
    }

    const mockManager = await initialize(userDefinedOptions)

    mockManager.activateMock('mock-one')

    t.true(mockManager.listActiveMocks().length === 1)
    t.true(mockManager.listActiveMocks()[0].indexOf('mock-one.foo.bar') !== -1)
})

test.serial('should activate expected group', async (t) => {
    const userDefinedOptions: UserDefinedOptions = {
        baseDirectory: path.join(__dirname, '_data'),
    }

    const mockManager = await initialize(userDefinedOptions)

    mockManager.activateMocksGroup('group-a')

    t.true(mockManager.listActiveMocks().length === 2)
    t.true(mockManager.listActiveMocks()[0].indexOf('mock-one.foo.bar') !== -1)
    t.true(mockManager.listActiveMocks()[1].indexOf('mock-two.foo.bar') !== -1)
})

test.serial('should remove all active mocks', async (t) => {
    const userDefinedOptions: UserDefinedOptions = {
        baseDirectory: path.join(__dirname, '_data'),
    }

    const mockManager = await initialize(userDefinedOptions)

    mockManager.activateMocksGroup('group-a')

    t.true(mockManager.listActiveMocks().length === 2)

    mockManager.resetMocks()

    t.true(mockManager.listActiveMocks().length === 0)
})
