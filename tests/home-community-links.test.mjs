import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  hasAuthor,
  homeCommunityLinks,
} from '../.vitepress/shared/homeCommunityLinks.mjs'

test('home community links data no longer exposes multiple author preview styles', () => {
  const sharedModuleSource = readFileSync(new URL('../.vitepress/shared/homeCommunityLinks.mjs', import.meta.url), 'utf8')

  assert.doesNotMatch(sharedModuleSource, /communityLinkAuthorPreviewStyles/)
  assert.doesNotMatch(sharedModuleSource, /样式 A/)
  assert.doesNotMatch(sharedModuleSource, /样式 C/)
})

test('home community links support optional author metadata per item', () => {
  assert.equal(homeCommunityLinks[0].text, '作业站')
  assert.equal(hasAuthor(homeCommunityLinks[0]), true)
  assert.deepEqual(homeCommunityLinks[0].author, {
    name: 'MrSnake',
    url: 'https://github.com/MrSnake0208',
  })

  assert.equal(hasAuthor(homeCommunityLinks[1]), false)
})

test('home community links component renders only the author badge variant', () => {
  const componentSource = readFileSync(new URL('../.vitepress/theme/components/HomeCommunityLinks.vue', import.meta.url), 'utf8')

  assert.match(componentSource, /home-community-links__author-badge/)
  assert.doesNotMatch(componentSource, /home-community-links__author-line/)
  assert.doesNotMatch(componentSource, /home-community-links__author-inline/)
  assert.doesNotMatch(componentSource, /communityLinkAuthorPreviewStyles/)
})
