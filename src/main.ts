import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const warnSize = safeParse('warning-size')
    const bounceSize = safeParse('bounce-size')
    const ignoreLabel = core.getInput('ignore-label')

    core.info(`warning-size: ${warnSize}`)
    core.info(`bounce-size: ${bounceSize}`)
    core.info(`ignore-label: ${ignoreLabel}`)
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
