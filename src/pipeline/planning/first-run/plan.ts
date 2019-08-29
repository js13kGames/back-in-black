import * as path from "path"
import keyValueObject from "../../utilities/key-value-object"
import StepBase from "../../steps/step-base"
import SerialStep from "../../steps/aggregators/serial-step"
import ParallelStep from "../../steps/aggregators/parallel-step"
import ReadTextFileStep from "../../steps/actions/files/read-text-file-step";
import ParseTypeScriptStep from "../../steps/actions/type-script/parse-type-script-step"
import CombineTypeScriptStep from "../../steps/actions/type-script/combine-type-script-step"
import HostStep from "../../steps/actions/host-step"
import WriteFileStep from "../../steps/actions/files/write-file-step"
import planDeletionOfPreviousArtifacts from "./plan-deletion-of-previous-artifacts"
import planCreationOfDirectories from "./plan-creation-of-directories"
import planParsingOfTypeScriptLibraries from "./plan-parsing-of-type-script-libraries"
import gameMinifiedHtmlStore from "../../stores/game-minified-html-store"
import hotReloadTextStore from "../../stores/hot-reload-text-store"
import hotReloadParsedStore from "../../stores/hot-reload-parsed-store"
import hotReloadCombinedStore from "../../stores/hot-reload-combined-store"
import compilerOptions from "../../steps/actions/type-script/compiler-options"

export default function (
  firstRun: boolean,
  debug: boolean
): StepBase {
  const deletionOfPreviousArtifactsThenCreationOfDirectoriesSteps: StepBase[] = []
  const typeScriptSteps: StepBase[] = []
  const hostSteps: StepBase[] = []
  if (firstRun) {
    deletionOfPreviousArtifactsThenCreationOfDirectoriesSteps.push(
      planDeletionOfPreviousArtifacts(),
      planCreationOfDirectories()
    )
    typeScriptSteps.push(
      planParsingOfTypeScriptLibraries()
    )

    if (debug) {
      const hotReloadIndex = path.join(`src`, `hot-reload`, `src`, `index.ts`)
      typeScriptSteps.push(
        new SerialStep(
          `readAndParseHotReload`,
          [
            new ReadTextFileStep(
              hotReloadIndex,
              text => hotReloadTextStore.set(text)
            ),
            new ParseTypeScriptStep(
              hotReloadIndex,
              () => hotReloadTextStore.get(),
              parsed => hotReloadParsedStore.set(parsed)
            )
          ]
        )
      )
      hostSteps.push(
        new CombineTypeScriptStep(
          () => [keyValueObject(hotReloadIndex, hotReloadParsedStore.get())],
          javascript => hotReloadCombinedStore.set(javascript),
        ),
        new HostStep(
          () => hotReloadCombinedStore.get(),
          gameName => gameMinifiedHtmlStore.tryGet(gameName)
        )
      )
    }
  }

  return new ParallelStep(
    `firstRun`,
    [
      new SerialStep(
        `deletionOfPreviousArtifactsThenCreationOfDirectories`,
        deletionOfPreviousArtifactsThenCreationOfDirectoriesSteps
      ),
      new SerialStep(
        `loadTypeScriptThenHost`,
        [
          new ParallelStep(
            `loadTypeScript`,
            typeScriptSteps
          ),
          new SerialStep(
            `host`,
            hostSteps
          )
        ]
      ),
      new WriteFileStep(
        () => JSON.stringify({
          include: [
            path.join(`**`, `*.ts`),
            path.join(`**`, `*.d.ts`),
            path.join(`**`, `*.json`)
          ],
          compilerOptions
        }),
        path.join(`src`, `engine`, `tsconfig.json`)
      ),
      new WriteFileStep(
        () => JSON.stringify({
          include: [
            path.join(`**`, `*.ts`),
            path.join(`**`, `*.d.ts`),
            path.join(`**`, `*.json`)
          ],
          compilerOptions
        }),
        path.join(`src`, `hot-reload`, `tsconfig.json`)
      )
    ]
  )
}
