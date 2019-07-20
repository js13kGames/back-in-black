const uglifyJs = require(`uglify-js`)
import StepBase from "../../step-base"
import ActionStepBase from "../action-step-base"

export default class CombineUglifyJsStep extends ActionStepBase {
  constructor(
    private readonly getParsed: () => ReadonlyArray<any>,
    private readonly storeResult: (combined: string) => void,
  ) {
    super(
      `combineUglifyJs`,
      [],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    const parsed = this.getParsed()
      .map(item => item.clone(true))

    const combined = parsed[0]

    parsed.slice(1).forEach(item => {
      combined.body = combined.body.concat(item.body)
      combined.end = item.end
    })

    const minified = uglifyJs.minify(combined, {
      compress: true,
      mangle: true,
      toplevel: true,
      output: {
        ast: false,
        code: true
      }
    })

    if (minified.error) {
      throw new Error(`Error combining parsed Javascript: ${JSON.stringify(minified.error)}`)
    }

    const code = minified.code.endsWith(`;`)
      ? minified.code.slice(0, minified.code.length - 1)
      : minified.code

    this.storeResult(code)
  }
}
