const version = 0
const beatsPerMinute = 80

type State = null

function initial(): State {
  return null
}

const roomSpacing = 42
const safeAreaWidthVirtualPixels = roomSpacing * 8
const safeAreaHeightVirtualPixels = roomSpacing * 6
const halfSafeAreaWidthVirtualPixels = safeAreaWidthVirtualPixels / 2
const halfSafeAreaHeightVirtualPixels = safeAreaHeightVirtualPixels / 2
const doubleSafeAreaWidthVirtualPixels = safeAreaWidthVirtualPixels * 2
const doubleSafeAreaHeightVirtualPixels = safeAreaHeightVirtualPixels * 2

const font: { readonly [character: string]: EngineSvg } = {
  a: font_a_svg,
  b: font_b_svg,
  c: font_c_svg,
  d: font_d_svg,
  e: font_e_svg,
  f: font_f_svg,
  g: font_g_svg,
  h: font_h_svg,
  i: font_i_svg,
  j: font_j_svg,
  k: font_k_svg,
  l: font_l_svg,
  m: font_m_svg,
  n: font_n_svg,
  o: font_o_svg,
  p: font_p_svg,
  q: font_q_svg,
  r: font_r_svg,
  s: font_s_svg,
  t: font_t_svg,
  u: font_u_svg,
  v: font_v_svg,
  w: font_w_svg,
  x: font_x_svg,
  y: font_y_svg,
  z: font_z_svg,
  0: font_number0_svg,
  1: font_number1_svg,
  2: font_number2_svg,
  3: font_number3_svg,
  4: font_number4_svg,
  5: font_number5_svg,
  6: font_number6_svg,
  7: font_number7_svg,
  8: font_number8_svg,
  9: font_number9_svg,
  ",": font_comma_svg
}

const transitionFrames: ReadonlyArray<EngineSvg> = [
  transition_a_svg,
  transition_b_svg,
  transition_c_svg,
  transition_d_svg,
  transition_e_svg,
  transition_f_svg,
  transition_g_svg,
  transition_h_svg,
  transition_i_svg
]
const transitionDuration = 0.6
function layers(
  layer: LayerFactory
): void {
  layer(
    safeAreaWidthVirtualPixels, doubleSafeAreaWidthVirtualPixels,
    safeAreaHeightVirtualPixels, doubleSafeAreaHeightVirtualPixels,
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
