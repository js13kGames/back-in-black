import * as recursiveReaddir from "recursive-readdir"
import isMonitored from "./files/is-monitored"
import Diff from "./files/diff"
import plan from "./planning/plan"

async function program(): Promise<void> {
  console.log(`Searching for files...`)
  const files = (await recursiveReaddir(`src`)).filter(isMonitored)
  console.log(`Planning...`)
  const step = plan(new Diff(files, [], [], []), true, false)
  console.log(`Executing plan...`)
  await step.executePerActionStep(async (step, execute) => {
    const description = step.getSingleLineDescription()
    console.log(`Starting step "${description}"...`)
    try {
      await execute()
    } catch (e) {
      console.error(`Error in step "${description}":`)
      console.error(e)
      process.exit(1)
    }
    console.log(`Completed step "${description}".`)
  })
  console.log(`Done.`)
}

program().then(
  () => { },
  (error: any) => {
    console.error(error)
    process.exit(1)
  }
)
