let engineTimeout: null | number = null
let now = 0

let engineEarliestTimer: null | {
  readonly at: number
  readonly callback: EngineMutationCallback
}
