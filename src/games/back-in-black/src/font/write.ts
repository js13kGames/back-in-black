function write(
  parent: EngineViewport | EngineAnimation,
  text: string
): void {
  let x = -7.5 * (text.length - 1)
  for (let i = 0; i < text.length; i++) {
    const baseSprite = sprite(parent, font_base_svg)
    translateX(baseSprite, x)
    const character = text.charAt(i)
    if (character != ` `) {
      const characterSprite = sprite(parent, font[character])
      translateX(characterSprite, x)
    }
    x += 15
  }
}
