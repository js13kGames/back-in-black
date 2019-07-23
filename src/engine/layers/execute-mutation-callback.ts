type EngineMutationCallback = (
  state: State,
  now: number,
  save: <T extends Json>(name: string, content: T) => boolean,
  load: <T extends Json>(name: string) => null | T,
  drop: (name: string) => boolean
) => void

function engineExecuteMutationCallback(
  callback: EngineMutationCallback
): void {
  callback(
    engineState,
    engineNow,
    engineSave,
    engineLoad,
    engineDrop
  )
  engineRender()
}
