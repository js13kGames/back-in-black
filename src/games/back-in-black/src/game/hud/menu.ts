type MenuOption = {
  readonly label: string
  callback(): void
}

type Menu = {
  readonly title: string
  readonly options: ReadonlyArray<MenuOption>
}

function renderNonInteractiveMenu(
  parent: EngineViewport | EngineAnimation,
  menu: Menu,
  enter: boolean,
): void {
  let y = menu.options.length * -16
  const title = group(parent)
  write(title, menu.title)
  translateY(title, y)
  if (enter) {
    hide(title)
    scaleX(title, 0.1)
    easeOut(title)
    elapse(120)
    show(title)
    scaleX(title, 10)
  }
  y += 32
  for (const option of menu.options) {
    const optionGroup = group(parent)
    translateY(optionGroup, y)
    const left = sprite(optionGroup, game_hud_button_svg)
    translateX(left, -109)
    const right = sprite(optionGroup, game_hud_button_svg)
    translateX(right, 109)
    scaleX(right, -1)
    write(optionGroup, option.label)
    if (enter) {
      hide(optionGroup)
      scaleX(optionGroup, 0.1)
      easeOut(optionGroup)
      elapse(120)
      show(optionGroup)
      scaleX(optionGroup, 10)
    }
    y += 32
  }
}

function renderInteractiveMenu(
  mainViewport: EngineViewport,
  menu: Menu,
): void {
  let y = (menu.options.length - 1) * -16
  for (const option of menu.options) {
    hitbox(mainViewport, -109, y, 218, 32, option.callback)
    y += 32
  }
}
