type EngineMutationCallback = (
  state: State,
  now: number,
  save: <T extends Json>(name: string, content: T) => Truthiness,
  load: <T extends Json>(name: string) => null | T,
  drop: (name: string) => Truthiness
) => void

function engineExecuteMutationCallback(
  callback: EngineMutationCallback
): void {
  callback(
    state,
    now,
    engineSave,
    engineLoad,
    engineDrop
  )
  engineRender()
}
