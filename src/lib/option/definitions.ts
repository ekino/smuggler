export type UserDefinedOptions = {
    baseDirectory?: string
    mocksDirectory?: string
    allowedExtensions?: string[]
    services: UserDefinedService[]
}

export type UserDefinedService = {
    name?: string
    host: string
    https?: boolean
}

export type Service = Required<UserDefinedService>

export type Options = Omit<Required<UserDefinedOptions>, 'services'> & {
    services: Required<Service>[]
}
