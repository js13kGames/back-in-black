type EngineMutationCallback = (
  now: number
) => void

function engineExecuteMutationCallback(
  callback: EngineMutationCallback
): void {
  callback(
    now
  )
  engineRender()
}
