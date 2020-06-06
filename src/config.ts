import * as core from '@actions/core'

export { Config }

class Config {
  warnSize: number
  bounceSize: number
  warnMessage: string
  bounceMessage: string
  ignoreLabel: string
  autoClose: boolean
  fileExcluders: string[]
  generatedMarkers: string[]

  constructor() {
    this.warnSize = safeParse('warning-size')
    this.bounceSize = safeParse('bounce-size')
    this.warnMessage = core.getInput('warning-message')
    this.bounceMessage = core.getInput('bounce-message')
    this.ignoreLabel = core.getInput('ignore-label')
    this.autoClose = Boolean(core.getInput('auto-close'))

    const f = (all: string): string[] => {
      if (all.length === 0) {
        return []
      }
      const res = []
      for (const m of all.split(',')) {
        if (m.length !== 0) {
          res.push(m)
        }
      }
      return res
    }
    this.fileExcluders = f(core.getInput('file-excluders'))
    this.generatedMarkers = f(core.getInput('generated-markers'))
  }
}

function safeParse(name: string): number {
  const parsed = Number(core.getInput(name))
  if (isNaN(parsed)) {
    throw new Error(`${name} is not a number`)
  }
  return parsed
}
