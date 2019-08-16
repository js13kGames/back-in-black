const version = 1
const beatsPerMinute = 80

type Phase = {
  type: `blank`
} | {
  type: `title`
} | {
  type: `levelSelect`
}

type State = {
  unlockedLevels: number
  from: {
    readonly phase: Phase
    readonly started: number
  }
  to: null | {
    readonly phase: Phase
    readonly started: number
  }
}

function initial(): State {
  return {
    unlockedLevels: 1,
    from: {
      phase: {
        type: `title`
      },
      started: now
    },
    to: null
}
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
      switch (state.from.phase.type) {
        case `title`:
          draw(background_title_svg, [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
          hitbox(
            doubleSafeAreaWidthVirtualPixels,
            doubleSafeAreaHeightVirtualPixels,
            [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)],
            () => {
              if (!state.to) {
                state.to = {
                  phase: {
                    type: `levelSelect`
                  },
                  started: now
                }
              }
            }
          )
          break
        case `levelSelect`:
          draw(background_levelSelect_svg, [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
          hitbox(
            doubleSafeAreaWidthVirtualPixels,
            doubleSafeAreaHeightVirtualPixels,
            [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)],
            () => {
              if (!state.to) {
                state.to = {
                  phase: {
                    type: `title`
                  },
                  started: now
                }
              }
            }
          )
          break
      }
      animation(state.from.started, transitionFrames.slice(1).map((frame, i) => [
        transitionDuration / (transitionFrames.length - 1),
        () => {
          frame
          for (let j = i; j < transitionFrames.length; j++) {
            draw(transitionFrames[j], [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
          }
        }
      ]))
      if (state.to) {
        const to = state.to
        animation(to.started, transitionFrames.slice(1).map((frame, i) => [
          transitionDuration / (transitionFrames.length - 1),
          () => {
            frame
            for (let j = 0; j <= i; j++) {
              draw(transitionFrames[j], [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])
            }
          }
        ]))
        at(to.started + transitionDuration, () => {
          state.from = {
            phase: to.phase,
            started: now
          }
          state.to = null
        })
      }
      hitbox
    }
  )
}

function audioReady(): () => void {
  return () => {
  }
}
