import StepBase from "../steps/step-base"
import SerialStep from "../steps/aggregators/serial-step"
import ParallelStep from "../steps/aggregators/parallel-step"

export default class Diff<T> {
  constructor(
    public readonly added: ReadonlyArray<T>,
    public readonly updated: ReadonlyArray<T>,
    public readonly deleted: ReadonlyArray<T>,
    public readonly unmodified: ReadonlyArray<T>
  ) {
  }

  mapSets<TOutput>(
    callback: (input: ReadonlyArray<T>) => ReadonlyArray<TOutput>
  ): Diff<TOutput> {
    return new Diff<TOutput>(
      callback(this.added),
      callback(this.updated),
      callback(this.deleted),
      callback(this.unmodified)
    )
  }

  mapItems<TOutput>(
    callback: (input: T) => TOutput
  ): Diff<TOutput> {
    return this.mapSets(set => set.map(callback))
  }

  filter(
    callback: (item: T) => boolean
  ): Diff<T> {
    return this.mapSets(set => set.filter(callback))
  }

  separate<TBy extends {
    readonly [key: string]: any
  }>(
    callbacks: { readonly [key in keyof TBy]: (item: T) => null | TBy[key] }
  ): {
    readonly sortedByKey: { readonly [key in keyof TBy]: Diff<TBy[key]> }
    readonly allSorted: Diff<T>
    readonly unsorted: Diff<T>
  } {
    let anyMatches: (item: T) => boolean = item => false
    let noMatches: (item: T) => boolean = item => true
    for (const key in callbacks) {
      const oldAnyMatches = anyMatches
      const oldNoMatches = noMatches
      const nextCallback = callbacks[key]
      anyMatches = item => oldAnyMatches(item) || nextCallback(item) !== null
      noMatches = item => oldNoMatches(item) && nextCallback(item) === null
    }

    const output: {
      sortedByKey: { [key: string]: Diff<any> }
      readonly allSorted: Diff<T>
      readonly unsorted: Diff<T>
    } = {
      sortedByKey: {},
      allSorted: this.filter(anyMatches),
      unsorted: this.filter(noMatches)
    }

    for (const key in callbacks) {
      const callback = callbacks[key]
      output.sortedByKey[key] = this.mapItems(callback).filter(item => item !== null)
    }

    return output as {
      readonly sortedByKey: { readonly [key in keyof TBy]: Diff<TBy[key]> }
      readonly allSorted: Diff<T>
      readonly unsorted: Diff<T>
    }
  }

  requiresClean(): boolean {
    return this.added.length > 0
      || this.updated.length > 0
      || this.deleted.length > 0
  }

  requiresGenerate(): boolean {
    return this.added.length > 0
      || this.updated.length > 0
      || (this.deleted.length > 0 && this.unmodified.length > 0)
  }

  invalidatesDependents(): boolean {
    return this.requiresClean() || this.requiresGenerate()
  }

  generateSteps(
    name: string,
    regenerateAll: boolean,
    describe: (item: T) => string,
    cleanStepsFactory: (item: T) => ReadonlyArray<StepBase>,
    generateStepsFactory: (item: T) => ReadonlyArray<StepBase>
  ): StepBase {
    const steps: StepBase[] = []

    const itemsToClean = regenerateAll
      ? this.updated.concat(this.deleted).concat(this.unmodified)
      : this.updated.concat(this.deleted)

    const itemsToGenerate = regenerateAll
      ? this.added.concat(this.updated).concat(this.unmodified)
      : this.added.concat(this.updated)

    itemsToGenerate
      .filter(item => !itemsToClean.includes(item))
      .forEach(item => steps.push(new SerialStep(describe(item), generateStepsFactory(item))))

    itemsToGenerate
      .filter(item => itemsToClean.includes(item))
      .forEach(item => steps.push(new SerialStep(describe(item), new Array<StepBase>(new ParallelStep(`${describe(item)}-clean`, cleanStepsFactory(item))).concat(generateStepsFactory(item)))))

    itemsToClean
      .filter(item => !itemsToGenerate.includes(item))
      .forEach(item => cleanStepsFactory(item).forEach(step => steps.push(step)))

    return new ParallelStep(name, steps)
  }

  deduplicateItems(): Diff<T> {
    const distinctUpdated = new Set(
      this.updated.concat(this.added.filter(item => this.unmodified.includes(item)))
    )

    const distinctUnmodified = new Set(
      this.unmodified.filter(item => !distinctUpdated.has(item))
    )

    const distinctAdded = new Set(this.added.filter(item =>
      !distinctUnmodified.has(item) && !distinctUpdated.has(item)
    ))

    const distinctDeleted = new Set(this.deleted.filter(item =>
      !distinctUnmodified.has(item)
      && !distinctUpdated.has(item)
      && !distinctAdded.has(item)
    ))

    return new Diff(
      Array.from(distinctAdded),
      Array.from(distinctUpdated),
      Array.from(distinctDeleted),
      Array.from(distinctUnmodified)
    )
  }
}
