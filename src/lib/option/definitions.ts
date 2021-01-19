export type UserDefinedOptions = {
    baseDirectory?: string
    mocksDirectory?: string
    allowedExtensions?: string[]
}

export type Options = Required<UserDefinedOptions>
