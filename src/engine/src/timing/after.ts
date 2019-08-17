function after(
  time: undefined | number,
  render: () => void
): void {
  if (time !== undefined) {
    if (now >= time) {
      render()
    } else {
      at(time)
    }
  }
}
