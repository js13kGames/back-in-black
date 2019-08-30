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
  Keyframes,
}

type EngineAnimation = readonly [
  HTMLElement,
  EngineAnimationsKeyframe[],
]

let engineAnimationsElapsed: number
const engineAnimationsRenderedAnimations: Animation[] = []
let engineAnimationsTimeout: undefined | number

const engineAnimations: EngineAnimation[] = []

function engineAnimationsClear(): void {
  engineAnimations.length = 0
  engineAnimationsElapsed = 0
}

function engineAnimationsElapse(
  milliseconds: number
): void {
  engineAnimationsElapsed += milliseconds
}

function engineAnimationsCreate(
  parent: EngineViewport | EngineAnimation,
  element: HTMLElement,
): EngineAnimation {
  element.style.position = `absolute`
  element.style.transform = `none`
  element.style.opacity = engineAnimationsElapsed ? `0` : `1`

  parent[EngineViewportKey.InnerElement].appendChild(element)

  const keyframes: EngineAnimationsKeyframe[] = engineAnimationsElapsed
    ? [{
      offset: engineAnimationsElapsed,
      easing: `step-end`,
      transform: `none`,
      opacity: `1`,
    }]
    : []

  const animation: EngineAnimation = [
    element,
    keyframes,
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
  if (engineAnimationsElapsed) {
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
  const keyframes = animation[EngineAnimationKey.Keyframes]
  if (keyframes.length) {
    return keyframes[keyframes.length - 1]
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

  const keyframes = animation[EngineAnimationKey.Keyframes]

  const newKeyframe: EngineAnimationsKeyframe = {
    offset: engineAnimationsElapsed,
    easing: `step-end`,
    transform: previousTransform.transform,
    opacity: previousTransform.opacity,
  }

  keyframes.push(newKeyframe)

  return newKeyframe
}

function engineAnimationsGetOrCreateCurrentKeyframe(
  animation: EngineAnimation,
): EngineAnimationsKeyframe {
  const keyframes = animation[EngineAnimationKey.Keyframes]

  if (keyframes.length) {
    const lastKeyframe = keyframes[keyframes.length - 1]
    if (lastKeyframe.offset == engineAnimationsElapsed) {
      return lastKeyframe
    }
  }

  return engineAnimationsCreateKeyframe(animation)
}

function engineAnimationsSendToBrowser(): void {
  for (const renderedAnimation of engineAnimationsRenderedAnimations) {
    renderedAnimation.cancel()
  }
  engineAnimationsRenderedAnimations.length = 0
  clearTimeout(engineAnimationsTimeout)
  engineAnimationsTimeout = undefined

  for (const animation of engineAnimations) {
    const element = animation[EngineAnimationKey.Element]
    const keyframes = animation[EngineAnimationKey.Keyframes]

    if (engineAnimationsElapsed) {
      if (keyframes.length) {
        const firstKeyframe = keyframes[0]
        const lastKeyframe = keyframes[keyframes.length - 1]
        for (const keyframe of keyframes) {
          keyframe.offset /= engineAnimationsElapsed
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
          duration: engineAnimationsElapsed,
          iterations: engineViewportsCallback ? 1 : Infinity,
          fill: `forwards`,
        }))
      }
    }
  }

  if (engineViewportsCallback) {
    const callback = engineViewportsCallback

    if (engineAnimationsRenderedAnimations.length) {
      engineAnimationsRenderedAnimations[0].onfinish = handleCallback
    } else {
      engineAnimationsTimeout = setTimeout(handleCallback, engineAnimationsElapsed)
    }

    function handleCallback(): void {
      callback()
      engineRender()
    }
  }
}
