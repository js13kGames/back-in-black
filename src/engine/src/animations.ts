type EngineAnimationEasing =
  | `step-end`
  | `linear`
  | `ease-in`
  | `ease-out`
  | `ease-in-out`
  | `ease`

type EngineAnimationsKeyframe = {
  offset: number
  easing: EngineAnimationEasing
  transform: string
  opacity: string
}

const enum EngineAnimationKey {
  // This must share an index with EngineViewportKey.OuterElement.
  Element,
  KeyframesByPhase,
}

type EngineAnimation = readonly [
  HTMLElement,
  EngineAnimationsKeyframe[][],
]

const engineAnimationsPhaseDurations: number[] = []
let engineAnimationsIndexOfCurrentPhase: number
const engineAnimationsRenderedAnimations: Animation[] = []
let engineAnimationsTimeout: undefined | number

const engineAnimations: EngineAnimation[] = []

function engineAnimationsClear(): void {
  engineAnimations.length = 0
  engineAnimationsIndexOfCurrentPhase = 0
  engineAnimationsPhaseDurations.length = 0
  engineAnimationsPhaseDurations.push(0)
}

function engineAnimationsElapse(
  milliseconds: number
): void {
  engineAnimationsPhaseDurations[engineAnimationsPhaseDurations.length - 1] += milliseconds
}

function engineAnimationsPhase(): void {
  engineAnimationsPhaseDurations.push(0)
}

function engineAnimationsCreate(
  parent: EngineViewport | EngineAnimation,
  element: HTMLElement,
): EngineAnimation {
  element.style.position = `absolute`
  element.style.transform = `none`
  const indexOfLatestPhase = engineAnimationsPhaseDurations.length - 1
  element.style.opacity = indexOfLatestPhase || engineAnimationsPhaseDurations[0]
    ? `0`
    : `1`

  parent[EngineViewportKey.InnerElement].appendChild(element)

  const keyframesByPhase: EngineAnimationsKeyframe[][] = []

  const durationOfLatestPhase = engineAnimationsPhaseDurations[indexOfLatestPhase]
  if (indexOfLatestPhase || durationOfLatestPhase) {
    keyframesByPhase[indexOfLatestPhase] = [{
      offset: durationOfLatestPhase,
      easing: `step-end`,
      transform: `none`,
      opacity: `1`,
    }]
  }

  const animation: EngineAnimation = [
    element,
    keyframesByPhase,
  ]

  engineAnimations.push(animation)

  return animation
}

function engineAnimationsGetTransformTarget(
  animation: EngineAnimation,
): {
  transform: null | string
  opacity: null | string
} {
  if (engineAnimationsPhaseDurations.length > 1 || engineAnimationsPhaseDurations[0]) {
    return engineAnimationsGetOrCreateCurrentKeyframe(animation)
  } else {
    return animation[EngineAnimationKey.Element].style
  }
}

function engineAnimationsFindPreviousTransform(
  animation: EngineAnimation,
): {
  readonly transform: string
  readonly opacity: string
} {
  const keyframesByPhase = animation[EngineAnimationKey.KeyframesByPhase]
  for (let phaseIndex = keyframesByPhase.length - 1; phaseIndex >= 0; phaseIndex--) {
    const keyframes = keyframesByPhase[phaseIndex]
    if (keyframes) {
      return keyframes[keyframes.length - 1]
    }
  }

  // TODO: Although we've definitely set these, retrieving them from the element
  //       again is not very good.
  return animation[EngineAnimationKey.Element].style as {
    readonly transform: string
    readonly opacity: string
  }
}

function engineAnimationsCreateKeyframe(
  animation: EngineAnimation,
): EngineAnimationsKeyframe {
  const previousTransform = engineAnimationsFindPreviousTransform(animation)

  const keyframesByPhase = animation[EngineAnimationKey.KeyframesByPhase]
  const indexOfLatestPhase = engineAnimationsPhaseDurations.length - 1
  const durationOfLatestPhase = engineAnimationsPhaseDurations[indexOfLatestPhase]
  const latestPhase = keyframesByPhase[indexOfLatestPhase] = keyframesByPhase[indexOfLatestPhase] || []

  const newKeyframe: EngineAnimationsKeyframe = {
    offset: durationOfLatestPhase,
    easing: `step-end`,
    transform: previousTransform.transform,
    opacity: previousTransform.opacity,
  }

  latestPhase.push(newKeyframe)

  return newKeyframe
}

function engineAnimationsGetOrCreateCurrentKeyframe(
  animation: EngineAnimation,
): EngineAnimationsKeyframe {
  const keyframesByPhase = animation[EngineAnimationKey.KeyframesByPhase]
  const indexOfLatestPhase = engineAnimationsPhaseDurations.length - 1
  const durationOfLatestPhase = engineAnimationsPhaseDurations[indexOfLatestPhase]

  const keyframes = keyframesByPhase[indexOfLatestPhase]

  if (keyframes) {
    const lastKeyframe = keyframes[keyframes.length - 1]
    if (lastKeyframe.offset == durationOfLatestPhase) {
      return lastKeyframe
    }
  }

  return engineAnimationsCreateKeyframe(animation)
}

function engineAnimationsSendNextPhaseToBrowser(): void {
  for (const renderedAnimation of engineAnimationsRenderedAnimations) {
    renderedAnimation.cancel()
  }
  engineAnimationsRenderedAnimations.length = 0
  clearTimeout(engineAnimationsTimeout)
  engineAnimationsTimeout = undefined

  const lastPhase = engineAnimationsIndexOfCurrentPhase == engineAnimationsPhaseDurations.length - 1

  const phaseDuration = engineAnimationsPhaseDurations[engineAnimationsIndexOfCurrentPhase]

  for (const animation of engineAnimations) {
    const element = animation[EngineAnimationKey.Element]
    const keyframesByPhase = animation[EngineAnimationKey.KeyframesByPhase]
    const keyframes = keyframesByPhase[engineAnimationsIndexOfCurrentPhase]

    if (phaseDuration) {
      if (engineAnimationsIndexOfCurrentPhase) {
        const previousKeyframes = keyframesByPhase[engineAnimationsIndexOfCurrentPhase - 1]
        if (previousKeyframes) {
          const lastKeyframe = previousKeyframes[previousKeyframes.length - 1]
          element.style.transform = lastKeyframe.transform
          element.style.opacity = lastKeyframe.opacity
        }
      }

      if (keyframes) {
        const firstKeyframe = keyframes[0]
        const lastKeyframe = keyframes[keyframes.length - 1]
        for (const keyframe of keyframes) {
          keyframe.offset /= phaseDuration
        }

        if (firstKeyframe.offset > 0) {
          keyframes.unshift({
            offset: 0,
            easing: `step-end`,
            transform: element.style.transform as string,
            opacity: element.style.opacity as string,
          })
        }

        if (lastKeyframe.offset < 1) {
          keyframes.push({
            offset: 1,
            easing: `step-end`,
            transform: lastKeyframe.transform,
            opacity: lastKeyframe.opacity,
          })
        }

        engineAnimationsRenderedAnimations.push(element.animate(keyframes, {
          duration: phaseDuration,
          iterations: lastPhase ? Infinity : 1,
          fill: `forwards`,
        }))
      }
    } else {
      if (keyframes) {
        const firstKeyframe = keyframes[0]
        element.style.transform = firstKeyframe.transform
        element.style.opacity = firstKeyframe.opacity
      } else {
        const previousKeyframes = keyframesByPhase[engineAnimationsIndexOfCurrentPhase - 1]
        if (previousKeyframes) {
          const lastKeyframe = previousKeyframes[previousKeyframes.length - 1]
          element.style.transform = lastKeyframe.transform
          element.style.opacity = lastKeyframe.opacity
        }
      }
    }
  }

  engineAnimationsIndexOfCurrentPhase++

  if (!lastPhase) {
    if (engineAnimationsRenderedAnimations.length) {
      engineAnimationsRenderedAnimations[0].onfinish = engineAnimationsSendNextPhaseToBrowser
    } else {
      engineAnimationsTimeout = setTimeout(engineAnimationsSendNextPhaseToBrowser, phaseDuration)
    }
  }
}
