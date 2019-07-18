import * as fs from "fs"
import * as chokidar from "chokidar"
import * as types from "../../types"
import isMonitored from "./is-monitored"

export default function (
  onChange: types.FileChangeHandler
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    resolve // Required as positional.

    let running = false
    let invalidated = false
    let throttling: null | NodeJS.Timer = null
    const pathVersions: { [path: string]: number } = {}
    let ranAtLeastOnce = false

    startThrottling()
    chokidar
      .watch(`src`, {
        awaitWriteFinish: {
          stabilityThreshold: 250,
          pollInterval: 50
        }
      })
      .on(`add`, (path, stats) => handle(`add`, path, stats))
      .on(`change`, (path, stats) => handle(`change`, path, stats))
      .on(`unlink`, path => {
        if (isMonitored(path)) {
          console.log(`"unlink" of "${path}"`)
          delete pathVersions[path]
          invalidate()
        }
      })
      .on(`error`, error => { throw error })

    function handle(event: string, path: string, stats: undefined | fs.Stats) {
      if (isMonitored(path)) {
        if (ranAtLeastOnce) {
          console.log(`"${event}" of "${path}"`)
        }
        if (!stats) {
          reject(new Error(`No stats for "${event}" of "${path}"`))
        } else {
          pathVersions[path] = stats.mtime.getTime()
          invalidate()
        }
      }
    }

    function invalidate() {
      if (running) {
        console.log(`Waiting to restart...`)
        invalidated = true
        return
      }

      if (throttling === null) {
        if (ranAtLeastOnce) {
          console.log(`Throttling...`)
        }
      } else {
        if (ranAtLeastOnce) {
          console.log(`Continuing to throttle...`)
        }
        clearTimeout(throttling)
      }

      startThrottling()
    }

    function startThrottling() {
      throttling = setTimeout(() => {
        ranAtLeastOnce = true
        throttling = null
        invalidated = false
        running = true
        onChange(
          JSON.parse(JSON.stringify(pathVersions))
        ).then(
          () => {
            running = false
            if (invalidated) {
              invalidate()
            }
          },
          reject
        )
      }, ranAtLeastOnce ? 200 : 5000)
    }
  })
}
