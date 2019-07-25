type EngineMutationCallback = (
  now: number,
  save: <T extends Json>(name: string, content: T) => Truthiness,
  load: <T extends Json>(name: string) => null | T
) => void

function engineExecuteMutationCallback(
  callback: EngineMutationCallback
): void {
  callback(
    now,
    engineSave,
    engineLoad
  )
  engineRender()
}
