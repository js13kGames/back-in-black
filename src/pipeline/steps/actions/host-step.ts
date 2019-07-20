import * as express from "express"
import * as types from "../../types"
import StepBase from "../step-base"
import ActionStepBase from "./action-step-base"

export default class HostStep extends ActionStepBase {
  constructor(
    private readonly getPrefix: () => string,
    private readonly tryGetHtml: (gameName: string) => null | types.GeneratedHtml
  ) {
    super(
      `host`,
      [],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    return new Promise(
      (resolve, reject) => express()
        .get(/^\/([a-z]|[a-z][a-z0-9-]{0,48}[a-z0-9])$/, (request, response) => {
          const html = this.tryGetHtml(request.params[0])
          if (html === null) {
            response.sendStatus(404)
          } else {
            response.send(`
              <script>
                var engineUuid = ${JSON.stringify(html.uuid)}
                ${this.getPrefix()}
              </script>
              ${html.html}
            `)
          }
        })
        .get(/^\/([a-z]|[a-z][a-z0-9-]{0,48}[a-z0-9])\/uuid$/, (request, response) => {
          const html = this.tryGetHtml(request.params[0])
          if (html === null) {
            response.sendStatus(404)
          } else {
            response.setHeader(`content-type`, `text/plain`)
            response.send(html.uuid)
          }
        })
        .listen(3333, resolve)
    )
  }
}
