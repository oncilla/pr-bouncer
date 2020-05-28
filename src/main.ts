import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const warnSize = safeParse('warning-size')
    const bounceSize = safeParse('bounce-size')
    const ignoreLabel = core.getInput('ignore-label')

    core.debug(`warning-size: ${warnSize}`)
    core.debug(`warning-size: ${bounceSize}`)
    core.debug(`warning-size: ${ignoreLabel}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

function safeParse(name: string): number {
  let parsed = Number(core.getInput(name))
  if (isNaN(parsed)) {
    throw new Error(`${name} is not a number`)
  }
  return parsed
}

run()
