const version = 0
const beatsPerMinute = 80

type State = null

function initial(): State {
  return null
}

const roomSpacing = 42
const safeAreaWidthVirtualPixels = roomSpacing * 8
const safeAreaHeightVirtualPixels = roomSpacing * 6

function layers(
  layer: LayerFactory
): void {
  layer(
    safeAreaWidthVirtualPixels, safeAreaWidthVirtualPixels,
    safeAreaHeightVirtualPixels, safeAreaHeightVirtualPixels,
    0, 0,
    (draw, hitbox) => {
      draw(room_empty_svg, [translate(roomSpacing * 5, roomSpacing * 0)])
      draw(room_empty_svg, [translate(roomSpacing * 5, roomSpacing * 1)])
      draw(room_empty_svg, [translate(roomSpacing * 5, roomSpacing * 2)])
      draw(room_empty_svg, [translate(roomSpacing * 5, roomSpacing * 3)])
      draw(room_empty_svg, [translate(roomSpacing * 5, roomSpacing * 4)])
      draw(room_empty_svg, [translate(roomSpacing * 5, roomSpacing * 5)])
      draw(room_empty_svg, [translate(roomSpacing * 5, roomSpacing * 6)])
      draw(room_empty_svg, [translate(roomSpacing * 2, roomSpacing * 3)])
      draw(room_empty_svg, [translate(roomSpacing * 3, roomSpacing * 3)])
      draw(room_empty_svg, [translate(roomSpacing * 3, roomSpacing * 4)])
      draw(room_empty_svg, [translate(roomSpacing * 4, roomSpacing * 4)])
      draw(player_walk_svg, [translate(roomSpacing * 4, roomSpacing * 4)])
      draw(room_switch_a_svg, [translate(roomSpacing * 4, roomSpacing * 3)])
      draw(corridor_empty_svg, [translate(roomSpacing * 2, roomSpacing * 3)])
      draw(corridor_door_closed_svg, [translate(roomSpacing * 3, roomSpacing * 3)])
      draw(corridor_empty_svg, [translate(roomSpacing * 4, roomSpacing * 3), rotate(90)])
      draw(corridor_stairs_svg, [translate(roomSpacing * 3, roomSpacing * 3), rotate(90)])
      draw(corridor_goal_open_svg, [translate(roomSpacing * 2, roomSpacing * 3), rotate(180)])
      draw(corridor_ledge_svg, [translate(roomSpacing * 3, roomSpacing * 4)])
      hitbox
    }
  )
}

function audioReady(): () => void {
  return () => {
  }
}
