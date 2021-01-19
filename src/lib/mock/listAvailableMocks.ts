import { readdirSync, statSync } from 'fs'
import { join } from 'path'

import { Options } from '../option'

export const listAvailableMocks = ({ baseDirectory, mocksDirectory, allowedExtensions }: Options): string[] => {
    const rootDirectory = join(baseDirectory, mocksDirectory)
    return listMocksRecursively(rootDirectory, allowedExtensions)
}

const listMocksRecursively = (directory: string, allowedExtensions: string[]): string[] =>
    readdirSync(directory, { encoding: 'utf8' }).reduce((files, node) => {
        const child = join(directory, node)
        const childStats = statSync(child)
        if (childStats.isDirectory()) {
            return files.concat(listMocksRecursively(child, allowedExtensions))
        } else if (childStats.isFile() && hasAllowedExtension(node, allowedExtensions)) {
            files.push(child)
        }
        return files
    }, [] as string[])

export const hasAllowedExtension = (node: string, allowedExtensions: string[]): boolean =>
    !!allowedExtensions.find((it) => node.endsWith(`.${it}`))
