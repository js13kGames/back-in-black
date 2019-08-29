import * as uglifyJs from "uglify-js"
import StepBase from "../step-base"
import ActionStepBase from "./action-step-base"

export default class MinifyJsStep extends ActionStepBase {
  constructor(
    private readonly getJavascript: () => string,
    private readonly storeResult: (code: string) => void
  ) {
    super(
      `parseUglifyJs`,
      [],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    const parsed = uglifyJs.minify(this.getJavascript(), {
      compress: true,
      mangle: true,
      toplevel: true,
    })

    if (parsed.error) {
      throw new Error(`Error minifying Javascript: ${JSON.stringify(parsed.error)}`)
    }

    this.storeResult(parsed.code)
  }
}
