let enginePreviousDateNow: null | number = null

function engineMonotonic(): void {
  let delta = 0
  const nextDateNow = +new Date
  if (enginePreviousDateNow !== null) {
    delta = nextDateNow - enginePreviousDateNow
  }
  delta = Math.max(0, delta)

  let deltaCap = 0
  if (engineEarliestTimer != null) {
    deltaCap = Math.max(0, engineEarliestTimer.at - engineNow)
  }
  deltaCap = Math.max(0, deltaCap) + 250

  delta = Math.min(delta, deltaCap)

  engineNow += delta
  enginePreviousDateNow = nextDateNow
}
