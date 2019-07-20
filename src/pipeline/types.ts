import StepBase from "./steps/step-base"

export type FileVersions = {
  readonly [path: string]: number
}

export type EngineFile = {
  readonly path: string
  readonly name: string
  readonly extension: string
}

export type GameFile = {
  readonly path: string
  readonly game: string
  readonly name: string
  readonly extension: string
}

export type EnginePlanningResult = {
  readonly allGamesRequireJavascriptRegeneration: boolean
  readonly allGamesRequireHtmlRegeneration: boolean
  readonly step: StepBase
}

export type GeneratedHtml = {
  readonly html: string
  readonly uuid: string
}
