import * as path from "path"
import uuid = require("uuid")
import keyValueObject from "../../utilities/key-value-object"
import * as types from "../../types"
import Diff from "../../files/diff"
import StepBase from "../../steps/step-base"
import DeleteFromKeyValueStoreIfSetStep from "../../steps/actions/stores/delete-from-key-value-store-if-set-step"
import DeleteStep from "../../steps/actions/files/delete-step"
import RenderPugStep from "../../steps/actions/pug/render-pug-step"
import MinifyHtmlStep from "../../steps/actions/minify-html-step"
import ZipStep from "../../steps/actions/zip-step"
import ArbitraryStep from "../../steps/actions/arbitrary-step"
import WriteFileStep from "../../steps/actions/files/write-file-step"
import gameHtmlStore from "../../stores/game-html-store"
import gameMinifiedHtmlStore from "../../stores/game-minified-html-store"
import gameZipStore from "../../stores/game-zip-store"
import enginePugStore from "../../stores/engine-pug-store"
import gameJavascriptStore from "../../stores/game-javascript-store"

export default function (
  enginePlanningResult: types.EnginePlanningResult,
  games: Diff<string>
): StepBase {
  return games
    .generateSteps(
      `htmlGeneration`,
      enginePlanningResult.allGamesRequireHtmlRegeneration,
      item => item,
      item => [
        new DeleteFromKeyValueStoreIfSetStep(gameHtmlStore, item),
        new DeleteFromKeyValueStoreIfSetStep(gameMinifiedHtmlStore, item),
        new DeleteFromKeyValueStoreIfSetStep(gameZipStore, item),
        new DeleteStep(path.join(`dist`, `${item}.zip`))
      ],
      item => [
        new RenderPugStep(
          () => enginePugStore.get(),
          () => ({
            javascript: gameJavascriptStore.get(item)
          }),
          html => gameHtmlStore.set(item, html)
        ),
        new MinifyHtmlStep(
          () => gameHtmlStore.get(item),
          html => gameMinifiedHtmlStore.set(item, {
            html,
            uuid: uuid.v4()
          })
        ),
        new ZipStep(
          () => keyValueObject(
            `index.html`,
            Buffer.from(gameMinifiedHtmlStore.get(item).html, `utf8`)
          ),
          buffer => gameZipStore.set(item, buffer)
        ),
        new ArbitraryStep(
          `checkZipSize`,
          async () => {
            const bytes = gameZipStore.get(item).byteLength
            const maximumBytes = 13312
            const percentage = bytes * 100 / maximumBytes
            if (bytes > maximumBytes) {
              throw new Error(`The zip exceeds the size limit of ${maximumBytes} bytes by ${bytes - maximumBytes} bytes (${percentage - 100}%) at ${bytes} bytes (${percentage}%).`)
            } else {
              console.log()
              console.log(`Zip within size limit of ${maximumBytes} bytes at ${bytes} bytes (${percentage}%).`)
            }
          }
        ),
        new WriteFileStep(
          () => gameZipStore.get(item),
          path.join(`dist`, `${item}.zip`)
        )
      ]
    )
}
