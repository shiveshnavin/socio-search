const { existsSync, mkdirSync } = require('fs')
const path = require('path')
const { mergeTypeDefs } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files')
const generate = require('@graphql-codegen/cli').generate
const { print } = require('graphql')

module.exports = async function generateTsFromGraphQl(filePath) {
    if (!existsSync(filePath)) {
        console.warn(filePath, 'does not exists. skipping!')
        return
    }
    const name = path.basename(filePath).replace(".graphql", "")
    const baseDir = path.dirname(filePath)
    const opRel = path.join('gen', `${name}.ts`)
    const outputPath = path.join(baseDir, opRel)
    await generate(
        {
            schema: filePath,
            generates: {
                [outputPath]: {
                    plugins: ['typescript']
                }
            }
        },
        true
    )
    console.log('Generated', name, 'to', opRel)
}
if (!existsSync(path.join(__dirname, 'gen'))) {
    mkdirSync(path.join(__dirname, 'gen'))
}
let outputPath = path.join(__dirname, 'gen/model.ts')
const loadedFiles = loadFilesSync(`${__dirname}/**/*.graphql`)
const typeDefs = mergeTypeDefs(loadedFiles)
const printedTypeDefs = print(typeDefs)
generate(
    {
        schema: printedTypeDefs,
        generates: {
            [outputPath]: {
                plugins: ['typescript']
            }
        }
    },
    true
).then(()=>{
    console.log('Generated schema ts file', outputPath)
})
