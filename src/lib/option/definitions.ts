export type UserDefinedOptions = {
    /**
     * The base directory where to look for the mocks' directory.
     * The path **must be** absolute.
     * The default value is: {@link process.cwd()}.
     */
    baseDirectory?: string
    /**
     * The directory's name where to find the mocks definitions.
     * The default value is: {@link DEFAULT_MOCKS_DIRECTORY}.
     */
    mocksDirectory?: string
    /**
     * All allowed extensions for mock definitions.
     * The default value is: {@link DEFAULT_ALLOWED_EXTENSIONS}.
     */
    allowedExtensions?: string[]
    /**
     * The services you want to mock.
     * You **must** provide at least a service here.
     */
    services: UserDefinedService[]
}

export type UserDefinedService = {
    /**
     * A nicer name to give to the service.
     * When not set, it defaults to the {@code host}.
     */
    name?: string
    /**
     * The host with a port specified when non-standard (e.g. *my-api.foo.com:7777*)
     */
    host: string
    /**
     * Is the service called with HTTPS?
     */
    https?: boolean
}

export type Service = Required<UserDefinedService>

export type Options = Omit<Required<UserDefinedOptions>, 'services'> & {
    services: Required<Service>[]
}
