let engineTimeout: null | number = null
let engineTimeOfLastRender: number

let engineEarliestTimer: null | {
  readonly at: number
  readonly callback?: EngineMutationCallback
}
