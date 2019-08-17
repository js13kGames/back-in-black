function switchAt(
  time: undefined | number,
  renderBefore: () => void,
  renderAfter: () => void
): void {
  if (time === undefined) {
    renderBefore()
  } else if (now >= time) {
    renderAfter()
  } else {
    at(time)
    renderBefore()
  }
}
