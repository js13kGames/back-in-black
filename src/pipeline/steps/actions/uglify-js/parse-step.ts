const uglifyJs = require(`uglify-js`)
import StepBase from "../../step-base"
import ActionStepBase from "../action-step-base"

export default class ParseUglifyJsStep extends ActionStepBase {
  constructor(
    private readonly getJavascript: () => string,
    private readonly storeResult: (parsed: any) => void
  ) {
    super(
      `parseUglifyJs`,
      [],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    const parsed = uglifyJs.minify(this.getJavascript(), {
      parse: {},
      compress: false,
      mangle: false,
      output: {
        ast: true,
        code: false
      }
    })

    if (parsed.error) {
      throw new Error(`Error parsing Javascript: ${JSON.stringify(parsed.error)}`)
    }

    this.storeResult(parsed.ast)
  }
}
