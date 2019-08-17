function until(
  time: undefined | number,
  render: () => void
): void {
  if (time === undefined) {
    render()
  } else if (now < time) {
    render()
    at(time)
  }
}
