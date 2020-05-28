import * as core from '@actions/core'
import {context, GitHub} from '@actions/github'

async function run(): Promise<void> {
  try {
    const GITHUB_TOKEN = core.getInput('githubToken')
    const github = new GitHub(GITHUB_TOKEN)

    if (!context.payload.pull_request) {
      core.setFailed('Action running on non-pull request')
      return
    }

    const warnSize = safeParse('warning-size')
    const bounceSize = safeParse('bounce-size')
    const ignoreLabel = core.getInput('ignore-label')

    core.info('Checking if pull request should be bounced:')
    core.info(`warning-size: ${warnSize}`)
    core.info(`bounce-size: ${bounceSize}`)
    core.info(`ignore-label: ${ignoreLabel}`)

    const req = {
      ...context.repo,
      pull_number: context.payload.pull_request.number,
    }

    const pr = await github.pulls.get(req)
    for (var label of pr.data.labels) {
      if (label.name == ignoreLabel) {
        core.info("Ignoring pull request with label set.")
        return
      }
    }

    const files = await github.pulls.listFiles(req)
    const count = countAdditions(files.data)
    if (count >= bounceSize) {
      await github.issues.createComment({
        ...context.repo,
        issue_number: context.payload.pull_request.number,
        body: `:rotating_light: Pull request bounced :rotating_light:

The pull request has more than ${bounceSize} additional lines of code.
Please split it into smaller chunks.

If the pull request absolutely needs to be this big, ask a maintainer to set
the ignore flag.
`,
      })
      github.pulls.update({
        ...context.repo,
        pull_number: context.payload.pull_request.number,
        state: "closed",
      })
      core.setFailed("Exceeded maximum pull request size")
      return
    } else if (count >= warnSize) {
      await github.issues.createComment({
        ...context.repo,
        issue_number: context.payload.pull_request.number,
        body: `:warning: Pull request is big :warning:

The pull request has more than ${warnSize} additional lines of code.
Please split it into smaller chunks.

If the pull request absolutely needs to be this big, ask a maintainer to set
the ignore flag.
`,
      })
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}


interface File {
  filename: string,
  additions: number,
}


function countAdditions(files: File[]): number {
  let count = 0
  for (var file of files) {
    // TODO(roosd): filter generated files.
    count += file.additions
  }
  return count
}



function safeParse(name: string): number {
  const parsed = Number(core.getInput(name))
  if (isNaN(parsed)) {
    throw new Error(`${name} is not a number`)
  }
  return parsed
}

run()
