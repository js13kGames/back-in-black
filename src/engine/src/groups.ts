function engineGroupsCreate(
  parent: EngineViewport | EngineAnimation,
): EngineAnimation {
  const element = document.createElement(`div`)
  return engineAnimationsCreate(parent, element)
}
