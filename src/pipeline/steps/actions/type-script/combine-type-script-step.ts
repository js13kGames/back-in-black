import * as path from "path"
import * as typeScript from "typescript"
import StepBase from "../../step-base"
import ActionStepBase from "../action-step-base"
import libraryTypeScriptParsedStore from "../../../stores/library-type-script-parsed-store"
import compilerOptions from "./compiler-options"

export default class CombineTypeScriptStep extends ActionStepBase {
  constructor(
    private readonly getParsed: () => ReadonlyArray<{
      readonly [path: string]: typeScript.SourceFile
    }>,
    private readonly storeJavascript: (javascript: string) => void,
  ) {
    super(
      `combineTypeScript`,
      [],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    const nonLibraries: { [path: string]: typeScript.SourceFile } = {}

    this.getParsed()
      .forEach(
        source => Object
          .keys(source)
          .forEach(key => nonLibraries[key] = source[key])
      )

    const libraries = libraryTypeScriptParsedStore.getAll()

    const allSourceFiles: { [path: string]: typeScript.SourceFile } = {}

    for (const source of [nonLibraries, libraries]) {
      for (const path in source) {
        allSourceFiles[path] = source[path]
      }
    }

    const host = typeScript.createCompilerHost({})

    host.getSourceFile = (fileName: string, languageVersion: typeScript.ScriptTarget, onError?: (message: string) => void, shouldCreateNewSourceFile?: boolean): typeScript.SourceFile | undefined => {

      // TypeScript always seems to use forward slashes.
      fileName = fileName.replace(/\//g, path.sep)

      if (!Object.prototype.hasOwnProperty.call(allSourceFiles, fileName)) {
        const message = `Request for unexpected file ${JSON.stringify(fileName)}.`
        if (onError !== undefined) {
          onError(message)
          return undefined
        } else {
          throw new Error(message)
        }
      }

      return allSourceFiles[fileName]
    }

    host.writeFile = (fileName: string, data: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: ReadonlyArray<typeScript.SourceFile>) => {
      switch (fileName) {
        case `result.js`:
          this.storeJavascript(data)
          break

        default:
          const message = `Unexpected attempt to write file ${JSON.stringify(fileName)}.`
          if (onError !== undefined) {
            onError(message)
          } else {
            throw new Error(message)
          }
      }
    }

    const program = typeScript.createProgram({
      rootNames: Object.keys(allSourceFiles).sort(),
      options: compilerOptions,
      projectReferences: undefined,
      host,
      oldProgram: undefined,
      configFileParsingDiagnostics: []
    })

    const emitResult = program.emit()

    if (emitResult.diagnostics.length > 0) {
      let message = `Failed to combine TypeScript: `
      for (const diagnostic of emitResult.diagnostics) {
        const fileName = diagnostic.file !== undefined
          ? diagnostic.file.fileName
          : `(unknown)`
        const line = diagnostic.start !== undefined && diagnostic.file !== undefined
          ? `@${diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1}`
          : ``
        if (typeof diagnostic.messageText === `string`) {
          message += `\n${fileName}${line}: ${JSON.stringify(diagnostic.messageText)}`
        } else {
          function recurseChain(
            chain: typeScript.DiagnosticMessageChain,
          ): void {
            message += `\n${fileName}${line}: ${JSON.stringify(chain.messageText)}`
            if (chain.next) {
              for (const item of chain.next) {
                recurseChain(item)
              }
            }
          }
          recurseChain(diagnostic.messageText)
        }
      }
      throw new Error(message)
    }
  }
}
