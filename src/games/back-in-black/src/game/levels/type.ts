type Corridor = readonly [number, number, Facing]

type Level = {
  readonly name: string
  readonly mcguffin: readonly [number, number]
  readonly switches: ReadonlyArray<readonly [number, number]>
  readonly rooms: ReadonlyArray<readonly [number, number]>
  readonly goal: Corridor
  readonly ledges: ReadonlyArray<Corridor>
  readonly stairs: ReadonlyArray<Corridor>
  readonly openDoors: ReadonlyArray<Corridor>
  readonly closedDoors: ReadonlyArray<Corridor>
  readonly corridors: ReadonlyArray<Corridor>
}
