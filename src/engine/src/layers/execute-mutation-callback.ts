type EngineMutationCallback = (
  now: number,
  save: <T extends Json>(name: string, content: T) => Truthiness
) => void

function engineExecuteMutationCallback(
  callback: EngineMutationCallback
): void {
  callback(
    now,
    engineSave
  )
  engineRender()
}
