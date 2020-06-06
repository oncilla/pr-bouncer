import { Config } from '../src/config'
import * as process from 'process'

test('throws invalid number', async () => {
  process.env['INPUT_WARNING-SIZE'] = 'some-weird'
  process.env['INPUT_BOUNCES-SIZE'] = '1000'
  expect(() => {
    new Config()
  }).toThrow()
})

test('read excluders', async () => {
  process.env['INPUT_WARNING-SIZE'] = '500'
  process.env['INPUT_BOUNCES-SIZE'] = '1000'
  process.env['INPUT_FILE-EXCLUDERS'] = 'a,b,c'
  process.env['INPUT_GENERATED-MARKERS'] = 'd,e,f'

  const cfg = new Config()

  expect(cfg.fileExcluders).toStrictEqual(['a', 'b', 'c'])
  expect(cfg.generatedMarkers).toStrictEqual(['d', 'e', 'f'])
})
