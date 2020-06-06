import {additions} from '../src/file'

test('ignores files', async () => {
  const files = [
    {
      filename: 'not-matched',
      additions: 100
    },
    {
      filename: './__tests__/testdata/excluded/mock_files',
      additions: 1
    },
    {
      filename: './__tests__/testdata/excluded/mock_files/mocked.go',
      additions: 1
    },
    {
      filename: './__tests__/testdata/excluded/some_test.go',
      additions: 1
    },
    {
      filename: './__tests__/testdata/generated/marked',
      additions: 1
    },
    {
      filename: './__tests__/testdata/generated/marked.go',
      additions: 1
    }
  ]
  const ignore = ['_test.go', '/mock_']
  const generated = [
    'GENERATED FILE DO NOT EDIT',
    'Code generated by .* DO NOT EDIT'
  ]

  expect((await additions(files, ignore, generated)).additions).toBe(100)
})
