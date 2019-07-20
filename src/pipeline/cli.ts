import * as progress from "progress"
import * as types from "./types"
import watch from "./files/watch"
import diffFileVersions from "./files/diff-file-versions"
import plan from "./planning/plan"

async function program(): Promise<void> {
  let previousFileVersions: types.FileVersions = {}
  let firstRun = true
  await watch(async nextFileVersions => {
    const step = plan(diffFileVersions(previousFileVersions, nextFileVersions), firstRun, true)
    previousFileVersions = nextFileVersions
    firstRun = false
    let totalActions = 0
    await step.executePerActionStep(async (step, execute) => { totalActions++ })
    if (totalActions > 0) {
      const bar = new progress(
        `:bar :current/:total (:percent) :etas :message`,
        {
          width: 80,
          total: totalActions + 1,
        }
      )

      bar.render({ message: `Starting...` })

      try {
        await step.executePerActionStep(async (step, execute) => {
          const description = step.getSingleLineDescription()
          bar.render({ message: description })
          try {
            await execute()
          } catch (e) {
            console.error()
            console.error(`Error in step "${description}":`)
            throw e
          }
          bar.tick()
        })
      } catch (e) {
        console.error()
        console.error(e)
      }

      bar.tick({ message: `Done.` })
    } else {
      console.log(`Nothing to do.`)
    }
  })
}

program().then(
  () => { },
  (error: any) => {
    console.error(error)
    process.exit(1)
  }
)
