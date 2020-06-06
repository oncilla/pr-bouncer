import * as exec from '@actions/exec'

export {additions}

interface File {
  filename: string
  additions: number
}

class Result {
  additions = 0
  excluded: string[] = []
  generated: string[] = []
}

async function additions(
  files: File[],
  ignoreMatchers: string[],
  generatedMarkers: string[]
): Promise<Result> {
  const result = new Result()
  for (const file of files) {
    if (matches(file.filename, ignoreMatchers)) {
      result.excluded.push(file.filename)
      continue
    }
    if (await contains(file.filename, generatedMarkers)) {
      result.generated.push(file.filename)
      continue
    }
    result.additions += file.additions
  }
  return result
}

function matches(value: string, matchers: string[]): boolean {
  for (const m of matchers) {
    if (RegExp(m).test(value)) {
      return true
    }
  }
  return false
}

async function contains(file: string, markers: string[]): Promise<boolean> {
  for (const m of markers) {
    const code = await exec.exec('grep', [m, file], {
      ignoreReturnCode: true,
      silent: true
    })
    if (code === 0) {
      return true
    }
  }
  return false
}
