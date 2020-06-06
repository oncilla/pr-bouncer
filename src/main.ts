/* eslint-disable @typescript-eslint/camelcase */

import * as core from '@actions/core'
import {context, GitHub} from '@actions/github'

import {additions} from './file'
import {Config} from './config'

async function run(): Promise<void> {
  try {
    const GITHUB_TOKEN = core.getInput('github-token')
    const github = new GitHub(GITHUB_TOKEN)

    if (!context.payload.pull_request) {
      core.setFailed('Action running on non-pull request')
      return
    }
    core.info('Checking pull request for additions:')

    const cfg = new Config()
    core.info(JSON.stringify({config: cfg}, null, 4))

    const req = {
      ...context.repo,
      pull_number: context.payload.pull_request.number
    }

    const pr = await github.pulls.get(req)
    for (const label of pr.data.labels) {
      if (label.name === cfg.ignoreLabel) {
        core.info('Ignoring pull request with label set.')
        return
      }
    }

    const files = await github.pulls.listFiles(req)
    const result = await additions(
      files.data,
      cfg.fileExcluders,
      cfg.generatedMarkers
    )
    core.info(JSON.stringify({result}, null, 4))

    const count = result.additions

    if (count >= cfg.bounceSize) {
      await github.issues.createComment({
        ...context.repo,
        issue_number: context.payload.pull_request.number,
        body: `:rotating_light: Pull request bounced :rotating_light:

The pull request has more than ${cfg.bounceSize} additional lines of code.
Please split it into smaller chunks.

If the pull request absolutely needs to be this big, ask a maintainer to set
the ignore flag.
`
      })
      if (cfg.autoClose) {
        github.pulls.update({
          ...context.repo,
          pull_number: context.payload.pull_request.number,
          state: 'closed'
        })
      }
      core.setFailed('Exceeded maximum pull request size')
      return
    } else if (count >= cfg.warnSize) {
      await github.issues.createComment({
        ...context.repo,
        issue_number: context.payload.pull_request.number,
        body: `:warning: Pull request is big :warning:

The pull request has more than ${cfg.warnSize} additional lines of code.
Please split it into smaller chunks.

If the pull request absolutely needs to be this big, ask a maintainer to set
the ignore flag.
`
      })
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
