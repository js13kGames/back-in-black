import * as typeScript from "typescript"
import StepBase from "../../step-base"
import ActionStepBase from "../action-step-base"
import libraryTypeScriptParsedStore from "../../../stores/library-type-script-parsed-store"

export default class CombineTypeScriptStep extends ActionStepBase {
  constructor(
    private readonly getParsed: () => ReadonlyArray<{
      readonly [path: string]: typeScript.SourceFile
    }>,
    private readonly storeJavascript: (javascript: string) => void,
    private readonly storeTypes: (types: string) => void
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

        case `result.d.ts`:
          this.storeTypes(data)
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
      options: {
        allowJs: false,
        allowSyntheticDefaultImports: false,
        allowUmdGlobalAccess: false,
        allowUnreachableCode: false,
        allowUnusedLabels: false,
        alwaysStrict: false,
        baseUrl: ``,
        charset: `utf8`,
        //checkJs: true,
        composite: false,
        declaration: true,
        declarationDir: ``,
        declarationMap: false,
        diagnostics: false,
        disableSizeLimit: false,
        downlevelIteration: false,
        emitBOM: false,
        emitDeclarationOnly: false,
        emitDecoratorMetadata: false,
        esModuleInterop: false,
        experimentalDecorators: false,
        forceConsistentCasingInFileNames: true,
        importHelpers: false,
        incremental: false,
        inlineSourceMap: false,
        inlineSources: false,
        isolatedModules: false,
        jsx: typeScript.JsxEmit.None,
        //jsxFactory: ,
        keyofStringsOnly: false,
        lib: [
          `lib.dom.d.ts`,
          `lib.es5.d.ts`,
          `lib.scripthost.d.ts`
        ],
        listEmittedFiles: false,
        listFiles: false,
        //mapRoot: ,
        maxNodeModuleJsDepth: 0,
        module: typeScript.ModuleKind.None,
        moduleResolution: typeScript.ModuleResolutionKind.Classic,
        // newLine: ,
        noEmit: false,
        noEmitHelpers: true,
        noEmitOnError: true,
        noErrorTruncation: true,
        noFallthroughCasesInSwitch: true,
        noImplicitAny: true,
        noImplicitReturns: true,
        noImplicitThis: true,
        noImplicitUseStrict: true,
        noLib: false,
        noResolve: false,
        noStrictGenericChecks: false,
        noUnusedLocals: true,
        noUnusedParameters: true,
        //outDir: ,
        outFile: `result.js`,
        //paths: {},
        preserveConstEnums: false,
        preserveSymlinks: false,
        preserveWatchOutput: true,
        pretty: true,
        //reactNamespace: React,
        removeComments: true,
        resolveJsonModule: false,
        //rootDir: ,
        //rootDirs: [],
        skipDefaultLibCheck: false,
        skipLibCheck: false,
        sourceMap: false,
        //sourceRoot: ,
        strict: false,
        strictBindCallApply: true,
        strictFunctionTypes: true,
        strictPropertyInitialization: true,
        strictNullChecks: true,
        suppressExcessPropertyErrors: false,
        suppressImplicitAnyIndexErrors: false,
        target: typeScript.ScriptTarget.ES3,
        traceResolution: false,
        tsBuildInfoFile: undefined,
        types: [],
        typeRoots: []
      },
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
          let current: undefined | typeScript.DiagnosticMessageChain = diagnostic.messageText
          while (current !== undefined) {
            message += `\n${fileName}${line}: ${JSON.stringify(current.messageText)}`
            current = current.next
          }
        }
      }
      throw new Error(message)
    }
  }
}
