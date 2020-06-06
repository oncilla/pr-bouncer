<a href="https://github.com/oncilla/pr-bouncer/actions"><img alt="pr-bouncer status" src="https://github.com/oncilla/pr-bouncer/workflows/build-test/badge.svg"></a>

# :rotating_light: Pull Request Bouncer :rotating_light:

Tired of getting huge pull requests? Not comfortable being the bad guy for
rejecting them?

Your new buddy, the pull request bouncer, will take care of it! :+1:

You can configure the maximum number of additions a pull request is allowed to
have. Anything above, and the pull request is rejected. Optionally, you can even
let the bouncer automatically close the pull request.

Furthermore, you can specify a threshold above which the bouncer will comment a
warning message, and instruct the pull request author to split the pull request.

You can exclude files from counting towards the total additions, either based
on on the file path, or based on specific markers in the file.

Messages can be customized to give a personal touch.

## Usage

```yml
name: "Pull Request Bouncer"
on:
  pull_request: {}

jobs:
  bouncer:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - uses: oncilla/pr-bouncer@v1
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        warning-size: '750'
        bounce-size: '1000'
        ignore-label: 'no-bounce'
        file-excluders: '_test.go,\/mock_,BUILD.bazel'
        generated-markers: 'GENERATED FILE DO NOT EDIT'
        auto-close: 'false'
        warning-message: 'Custom warning message'
        bounce-message: 'Custom bounce message'
```

Check out the default values: [action.yml](action.yml)
