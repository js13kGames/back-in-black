import Diff from "../files/diff"
import separateEngineAndGame from "../files/separate-engine-and-game"
import StepBase from "../steps/step-base"
import SerialStep from "../steps/aggregators/serial-step"
import planFirstRun from "./first-run/plan"
import planEngine from "./engine/plan"
import planGames from "./games/plan"

export default function (
  diff: Diff<string>,
  firstRun: boolean,
  debug: boolean
): StepBase {
  const engineAndGame = separateEngineAndGame(diff, debug)

  const firstRunStep = planFirstRun(firstRun, debug)
  const enginePlanningResult = planEngine(debug, engineAndGame.engine)
  const gamesStep = planGames(debug, enginePlanningResult, engineAndGame.game)

  return new SerialStep(
    `root`,
    [
      firstRunStep,
      enginePlanningResult.step,
      gamesStep
    ]
  )
}
