import { promises } from 'fs'

function filterMatches(entries: string[], start: string) {
  return entries.filter(entry => entry.startsWith(start))
}

function parsePath(word: string) {
  const lastSlash = word.lastIndexOf('/')

  if (lastSlash === -1) {
    return { dir: '', base: word }
  }

  return { dir: word.slice(0, lastSlash), base: word.slice(lastSlash + 1) }
}

export async function completePath(word: string): Promise<string[]> {
  const { dir, base } = parsePath(word)
  const entries = await promises.readdir(dir || '.').catch(() => [])
  const matches = filterMatches(entries, base)
  const results = []
  for (const match of matches) {
    const path = (dir ? dir + '/' : '') + match
    const stats = await promises.stat(path)
    results.push(stats.isDirectory() ? path + '/' : path)
  }

  return results
}
