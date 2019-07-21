import * as types from "../../types"
import Diff from "../../files/diff"
import ParallelStep from "../../steps/aggregators/parallel-step"
import separateByType from "./separate-by-type"
import planTypeScript from "./plan-type-script"
import planPug from "./plan-pug"

export default function (
  debug: boolean,
  engineDiff: Diff<types.EngineFile>
): types.EnginePlanningResult {
  const typeSeparated = separateByType(debug, engineDiff)
  const typeScriptStep = planTypeScript(typeSeparated.sortedByKey.typeScript)
  const pugStep = planPug(typeSeparated.sortedByKey.pug)

  const allGamesRequireJavascriptRegeneration = typeSeparated.sortedByKey
    .typeScript.invalidatesDependents()
  const allGamesRequireHtmlRegeneration = allGamesRequireJavascriptRegeneration
    || typeSeparated.sortedByKey.pug.invalidatesDependents()

  return {
    allGamesRequireJavascriptRegeneration,
    allGamesRequireHtmlRegeneration,
    step: new ParallelStep(`engine`, [
      typeScriptStep,
      pugStep
    ])
  }
}
