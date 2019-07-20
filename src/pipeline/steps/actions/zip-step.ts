import bl = require("bl")
import * as archiver from "archiver"
import StepBase from "../step-base"
import ActionStepBase from "./action-step-base"

export default class ZipStep extends ActionStepBase {
  constructor(
    private readonly getFiles: () => { readonly [path: string]: Buffer },
    private readonly storeResult: (buffer: Buffer) => void
  ) {
    super(
      `zip`,
      [],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    const archive = archiver(`zip`)
    const files = this.getFiles()
    for (const path in files) {
      archive.append(files[path], { name: path })
    }
    this.storeResult(await new Promise<Buffer>((resolve, reject) => {
      archive.pipe(new bl((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      }))
      archive.finalize()
    }))
  }
}
