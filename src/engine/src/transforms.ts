function engineTransformsSetEasing(
  animation: EngineAnimation,
  easing: EngineAnimationEasing,
): void {
  engineAnimationsGetOrCreateCurrentKeyframe(animation).easing = easing
}

function engineTransformsSetOpacity(
  animation: EngineAnimation,
  opacity: number,
): void {
  engineAnimationsGetTransformTarget(animation).opacity = `${opacity}`
}

function engineTransformsApplyTransform(
  animation: EngineAnimation,
  transform: string,
): void {
  const keyframe = engineAnimationsGetTransformTarget(animation)

  if (keyframe.transform == `none`) {
    keyframe.transform = transform
  } else {
    keyframe.transform += ` ${transform}`
  }
}
