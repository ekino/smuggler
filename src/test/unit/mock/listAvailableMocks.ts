import avaTest, { TestInterface } from 'ava'
import fs, { Stats } from 'fs'
import path from 'path'
import { SinonStub, stub } from 'sinon'

import { hasAllowedExtension, listAvailableMocks } from '../../../lib/mock/listAvailableMocks'
import { Options } from '../../../lib/option'

type TestContext = {
    joinStub: SinonStub
    readdirSyncStub: SinonStub
    statSyncStub: SinonStub
}

const test = avaTest as TestInterface<TestContext>

test.before((t) => {
    t.context.joinStub = stub(path, 'join')
    t.context.readdirSyncStub = stub(fs, 'readdirSync')
    t.context.statSyncStub = stub(fs, 'statSync')
})

test.beforeEach((t) => {
    t.context.joinStub.reset()
    t.context.readdirSyncStub.reset()
    t.context.statSyncStub.reset()
})

test.after((t) => {
    t.context.joinStub.restore()
    t.context.readdirSyncStub.restore()
    t.context.statSyncStub.restore()
})

const givenAllowedExtension = ['json', 'js', 'ts']
const givenOptions: Options = {
    baseDirectory: './foo',
    mocksDirectory: '__mocks__',
    allowedExtensions: givenAllowedExtension,
}

const expectedRootDirectory = './foo/__mocks__'

test.serial('listAvailableMocks should collect files recursively from the root directory', (t) => {
    t.context.joinStub.returns(expectedRootDirectory)

    t.context.readdirSyncStub.returns([])

    listAvailableMocks(givenOptions)

    t.true(t.context.joinStub.calledOnceWithExactly(givenOptions.baseDirectory, givenOptions.mocksDirectory))
})

test.serial('listAvailableMocks should only list files with an allowed extension', (t) => {
    const filesFromDirectory = ['a.js', 'b.ts', 'c.yml', 'd.json']

    t.context.joinStub.onFirstCall().returns(expectedRootDirectory).returnsArg(1)

    t.context.readdirSyncStub.returns(filesFromDirectory)

    t.context.statSyncStub.returns(fileStat)

    const expectedMocks = ['a.js', 'b.ts', 'd.json']

    const mocks = listAvailableMocks(givenOptions)

    t.deepEqual(mocks, expectedMocks)
})

test.serial('listAvailableMocks should read directories recursively', (t) => {
    const filesFromDirectory = ['a.js', 'foo']
    const filesFromFooDirectory = ['b.js']

    t.context.joinStub.onFirstCall().returns(expectedRootDirectory).returnsArg(1)

    t.context.readdirSyncStub.onFirstCall().returns(filesFromDirectory).onSecondCall().returns(filesFromFooDirectory)

    t.context.statSyncStub.onSecondCall().returns(directoryStat).returns(fileStat)

    const expectedMocks = ['a.js', 'b.js']

    const mocks = listAvailableMocks(givenOptions)

    t.deepEqual(mocks, expectedMocks)
})

test('hasAllowedExtension should return true when file ends with an allowed extension', (t) => {
    const givenFileName = 'my-file.js'

    const hasExtension = hasAllowedExtension(givenFileName, givenAllowedExtension)

    t.true(hasExtension)
})

test('hasAllowedExtension should return false when file does not end with an allowed extension', (t) => {
    const givenFileName = 'my-file.yml'

    const hasExtension = hasAllowedExtension(givenFileName, givenAllowedExtension)

    t.false(hasExtension)
})

const directoryStat = {
    isDirectory: () => true,
    isFile: () => false,
} as Stats

const fileStat = {
    isDirectory: () => false,
    isFile: () => true,
} as Stats
