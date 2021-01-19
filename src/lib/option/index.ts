import { Options, UserDefinedOptions } from './definitions'

export const DEFAULT_BASE_DIRECTORY = './'
export const DEFAULT_MOCKS_DIRECTORY = '__mocks__'
export const DEFAULT_ALLOWED_EXTENSIONS = ['js']

export const getOptions = (options?: UserDefinedOptions): Options => {
    return {
        baseDirectory: options?.baseDirectory || DEFAULT_BASE_DIRECTORY,
        mocksDirectory: options?.mocksDirectory || DEFAULT_MOCKS_DIRECTORY,
        allowedExtensions: options?.allowedExtensions || DEFAULT_ALLOWED_EXTENSIONS,
    }
}

export * from './definitions'
