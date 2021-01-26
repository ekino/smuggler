import { TechnicalError } from '../error'
import { ErrorCode } from '../error/definitions'
import { Options, Service, UserDefinedOptions } from './definitions'

export const DEFAULT_MOCKS_DIRECTORY = '__mocks__'
export const DEFAULT_ALLOWED_EXTENSIONS = ['js']

export const getOptions = (options: UserDefinedOptions): Options => {
    validateOptions(options)
    return {
        baseDirectory: options.baseDirectory || process.cwd(),
        mocksDirectory: options.mocksDirectory || DEFAULT_MOCKS_DIRECTORY,
        allowedExtensions: options.allowedExtensions || DEFAULT_ALLOWED_EXTENSIONS,
        services: options.services.map(({ host, https, name }) => ({
            host,
            https: https ?? false,
            name: name || host,
        })),
    }
}

export const validateOptions = (options?: UserDefinedOptions): void => {
    if (!options) throw new TechnicalError(ErrorCode.MissingOption, 'Options are required')
    if (!Array.isArray(options.services) || !(options.services.length > 0))
        throw new TechnicalError(ErrorCode.MissingOption, 'Options is lacking a services configuration')
    options.services.forEach((it) => {
        if (!it?.host) throw new TechnicalError(ErrorCode.MissingOption, 'A service should at least have a host')
    })
}

export const getServiceBaseUrl = ({ host, https }: Required<Service>): string => `http${https ? 's' : ''}://${host}`

export * from './definitions'
