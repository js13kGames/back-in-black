type Facing =
  | `north`
  | `east`
  | `south`
  | `west`

const facingDegrees: { readonly [facing in Facing]: number } = {
  north: 270,
  east: 0,
  south: 90,
  west: 180,
}

const facingReverse: { readonly [facing in Facing]: Facing } = {
  north: `south`,
  east: `west`,
  south: `north`,
  west: `east`
}

const facingX: { readonly [facing in Facing]: number } = {
  north: 0,
  east: 1,
  south: 0,
  west: -1
}

const facingY: { readonly [facing in Facing]: number } = {
  north: -1,
  east: 0,
  south: 1,
  west: 0
}
