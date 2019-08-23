let engineKeyInputCallbacks: {
  [keyCode in EngineKeyCode]?: EngineMutationCallback
}

function engineKeyInputHandleKey(e: KeyboardEvent): void {
  const callback = engineKeyInputCallbacks[e.code as EngineKeyCode]
  if (callback) {
    callback()
    engineRender()
    e.preventDefault()
  }
}

function engineKeyInputStartRender(): void {
  engineKeyInputCallbacks = {}
}

type EngineKeyCode =
  | `Escape`
  | `Digit0`
  | `Digit1`
  | `Digit2`
  | `Digit3`
  | `Digit4`
  | `Digit5`
  | `Digit6`
  | `Digit7`
  | `Digit8`
  | `Digit9`
  | `Minus`
  | `Equal`
  | `Backspace`
  | `Tab`
  | `KeyQ`
  | `KeyW`
  | `KeyE`
  | `KeyR`
  | `KeyT`
  | `KeyY`
  | `KeyU`
  | `KeyI`
  | `KeyO`
  | `KeyP`
  | `BracketLeft`
  | `BracketRight`
  | `Enter`
  | `ControlLeft`
  | `KeyA`
  | `KeyS`
  | `KeyD`
  | `KeyF`
  | `KeyG`
  | `KeyH`
  | `KeyJ`
  | `KeyK`
  | `KeyL`
  | `Semicolon`
  | `Quote`
  | `Backquote`
  | `ShiftLeft`
  | `KeyZ`
  | `KeyX`
  | `KeyC`
  | `KeyV`
  | `KeyB`
  | `KeyN`
  | `KeyM`
  | `Comma`
  | `Period`
  | `Slash`
  | `ShiftRight`
  | `NumpadMultiply`
  | `AltLeft`
  | `Space`
  | `CapsLock`
  | `F1`
  | `F2`
  | `F3`
  | `F4`
  | `F5`
  | `F6`
  | `F7`
  | `F8`
  | `F9`
  | `F10`
  | `Numpad7`
  | `Numpad8`
  | `Numpad9`
  | `NumpadSubtract`
  | `Numpad4`
  | `Numpad5`
  | `Numpad6`
  | `NumpadAdd`
  | `Numpad1`
  | `Numpad2`
  | `Numpad3`
  | `Numpad0`
  | `NumpadDecimal`
  | `IntlBackslash`
  | `F11`
  | `F12`
  | `IntlYen`
  | `NumpadEnter`
  | `ControlRight`
  | `NumpadDivide`
  | `AltRight`
  | `NumLock`
  | `Home`
  | `ArrowUp`
  | `PageUp`
  | `ArrowLeft`
  | `ArrowRight`
  | `End`
  | `ArrowDown`
  | `PageDown`
  | `Delete`
