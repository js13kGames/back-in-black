type Level = {
  readonly name: string
  readonly mcguffin: readonly [number, number]
  readonly switches: ReadonlyArray<readonly [number, number]>
  readonly rooms: ReadonlyArray<{
    readonly type: `empty`
    readonly x: number
    readonly y: number
  }>
  readonly corridors: ReadonlyArray<{
    readonly type: `empty` | `ledge` | `stairs` | `openDoor` | `closedDoor` | `goal`
    readonly x: number
    readonly y: number
    readonly facing: Facing
  }>
}
