export const isObject = <T>(obj?: T | null): obj is T => isDefined(obj) && typeof obj === 'object'

export const isFunction = <T>(obj?: T | null): obj is T => isDefined(obj) && typeof obj === 'function'

export const hasFunction = (obj: Record<string, unknown>, functionName: string): boolean =>
    isObject(obj) && functionName in obj && isFunction(obj[functionName])

export const isDefined = <T>(obj?: T | null): obj is T => !!obj
