# @ekino/smuggler
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ekino/smuggler/build?style=flat-square)](https://github.com/ekino/smuggler/actions)
[![Coveralls github branch](https://img.shields.io/coveralls/github/ekino/smuggler/main?style=flat-square)](https://coveralls.io/github/ekino/smuggler?branch=main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm (scoped)](https://img.shields.io/npm/v/@ekino/smuggler?style=flat-square)](https://www.npmjs.com/package/@ekino/smuggler)

This library aims to provide a simple way to handle HTTP mock declarations through [Nock](https://github.com/nock/nock).

It has been thought as a simple component to load mock definitions from a directory. Then, the mocks could get activated on demand.

For instance, an express/koa middle could look for a `x-mock-id` header and when found load the mock associated with this id.

## Mock definitions

For now, only `js` files could get imported, but we'll improve that in the future!

### JavaScript

```javascript
const nock = require('nock')

module.exports = {
    id: 'mock-id',
    groupId: 'optional-mock-id',
    declareMock: () => {
        nock('http://foo.bar').get('/').reply(200)
    }
}
```

## Initializing

In order to initialize the `MockManager` (we'll talk about it right after), you just need to call the `initialize` method like so:

```javascript
const { initialize } = require('@ekino/smuggler')

var mockManager = initialize()
```

By default, this function will look for a `__mocks__` directory in the current directory and load any `js` file.

If you want to modify that, just pass in custom options:

```javascript
const { initialize } = require('@ekino/smuggler')

var mockManager = initialize({
    baseDirectory: '/absolute/path',
    mocksDirectory: 'mocks-directory-name',
    extensions: ['js']
})
```

## The `MockManager`

It's the only component you should worry about as it's the one which will allow you to interact with the loaded definitions.

### `MockManager#activateMock`

It looks for a mock with the given `id` and loads it if it has been found.

```javascript
mockManager.activateMock('mock-id')
```

### `MockManager#activateMocksGroup`

It looks for every mock with the given `group-id` and loads them all.

```javascript
mockManager.activateMocksGroup('group-id')
```

### `MockManager#listActiveMocks`

It lists all active mocks known to `nock` as a string array (see [nock.activeMocks()](https://github.com/nock/nock#pendingmocks)).

```javascript
mockManager.listActiveMocks()
```

### `MockManager#listPendingMocks`

It lists all pending mocks known to `nock` as a string array (see [nock.pendingMocks()](https://github.com/nock/nock#pendingmocks)).

```javascript
mockManager.listPendingMocks()
```

### `MockManager#checkNoPendingMocks`

It looks at nock pending mocks and if there's at least one it throws an error.

```javascript
mockManager.checkNoPendingMocks()
```

### `MockManager#resetMocks`

It will clean nock from any mocks (see [nock.cleanAll()](https://github.com/nock/nock#cleanall) and [nock.restore()](https://github.com/nock/nock#restoring)).

```javascript
mockManager.resetMocks()
```

## Examples

You can find examples of usage in the `examples` directory.

### Express

[Express example](./examples/express/README.md)
