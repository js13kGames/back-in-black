import * as types from "../../types"
import Diff from "../../files/diff"
import StepBase from "../../steps/step-base"
import ParallelStep from "../../steps/aggregators/parallel-step"
import SerialStep from "../../steps/aggregators/serial-step"
import separateByType from "./separate-by-type"
import planTypeScript from "./plan-type-script"
import planSvg from "./plan-svg"
import planJavascriptGeneration from "./plan-javascript-generation"
import planHtmlGeneration from "./plan-html-generation"

export default function (
  debug: boolean,
  enginePlanningResult: types.EnginePlanningResult,
  gamesDiff: Diff<types.GameFile>
): StepBase {
  const typeSeparated = separateByType(debug, gamesDiff)
  const typeScriptSteps = planTypeScript(typeSeparated.sortedByKey.typeScript)
  const svgSteps = planSvg(typeSeparated.sortedByKey.svg)
  const javaScriptSteps = planJavascriptGeneration(
    enginePlanningResult, typeSeparated.allSorted
  )
  const games = typeSeparated.allSorted
    .mapItems(item => item.game)
    .deduplicateItems()
  const htmlGenerationSteps = planHtmlGeneration(
    enginePlanningResult, games
  )

  return new SerialStep(
    `games`,
    [
      new ParallelStep(
        `files`,
        [typeScriptSteps, svgSteps]
      ),
      javaScriptSteps,
      htmlGenerationSteps
    ]
  )
}
