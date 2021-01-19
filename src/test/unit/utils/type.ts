import test, { Macro } from 'ava'

import { hasFunction, isDefined, isFunction, isObject } from '../../../lib/utils/type'

const isObjectMacro: Macro<[unknown, boolean]> = (t, givenInput: unknown, expected: boolean) => {
    t.is(isObject(givenInput), expected)
}

test('isObject should be true when the input is an object', isObjectMacro, {}, true)

test('isObject should be false when the input is null', isObjectMacro, null, false)

test('isObject should be false when the input is undefined', isObjectMacro, undefined, false)

test('isObject should be false when the input is a function', isObjectMacro, () => 0, false)

const isFunctionMacro: Macro<[unknown, boolean]> = (t, givenInput: unknown, expected: boolean) => {
    t.is(isFunction(givenInput), expected)
}

test('isFunction should be true when the input is a function', isFunctionMacro, () => 0, true)

test('isFunction should be false when the input is null', isFunctionMacro, null, false)

test('isFunction should be false when the input is undefined', isFunctionMacro, undefined, false)

test('isFunction should be false when the input is a function', isFunctionMacro, {}, false)

const isDefinedMacro: Macro<[unknown, boolean]> = (t, givenInput: unknown, expected: boolean) => {
    t.is(isDefined(givenInput), expected)
}

test('isDefined should be true when the input is not null nor undefined', isDefinedMacro, {}, true)

test('isDefined should be false when the input is undefined', isDefinedMacro, undefined, false)

test('isDefined should be false when the input is null', isDefinedMacro, null, false)
