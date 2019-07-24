import * as types from "../../types"
import Diff from "../../files/diff"
import StepBase from "../../steps/step-base"
import ParallelStep from "../../steps/aggregators/parallel-step"
import SerialStep from "../../steps/aggregators/serial-step"
import separateByType from "./separate-by-type"
import planGeneratedTypeScript from "./plan-generated-type-script"
import planTypeScript from "./plan-type-script"
import planSvg from "./plan-svg"
import planJavascriptGeneration from "./plan-javascript-generation"
import planHtmlGeneration from "./plan-html-generation"
import planTsconfig from "./plan-tsconfig"

export default function (
  debug: boolean,
  enginePlanningResult: types.EnginePlanningResult,
  gamesDiff: Diff<types.GameFile>
): StepBase {
  const typeSeparated = separateByType(debug, gamesDiff)
  const games = typeSeparated.allSorted
    .mapItems(item => item.game)
    .deduplicateItems()
  const generatedTypeScriptSteps = planGeneratedTypeScript(games)
  const typeScriptSteps = planTypeScript(typeSeparated.sortedByKey.typeScript)
  const svgSteps = planSvg(typeSeparated.sortedByKey.svg)
  const javaScriptSteps = planJavascriptGeneration(
    enginePlanningResult, typeSeparated.allSorted
  )
  const htmlGenerationSteps = planHtmlGeneration(
    enginePlanningResult, games
  )
  const tsconfigSteps = planTsconfig(games)

  return new ParallelStep(
    `games`,
    [
      tsconfigSteps,
      new SerialStep(
        `builds`,
        [
          generatedTypeScriptSteps,
          new ParallelStep(
            `files`,
            [typeScriptSteps, svgSteps]
          ),
          javaScriptSteps,
          htmlGenerationSteps
        ]
      )
    ]
  )
}
