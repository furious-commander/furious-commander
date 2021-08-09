const fs = require('fs')

function createDirectory(path) {
  fs.mkdirSync(path, { recursive: true })
}

function setupTestData() {
  try {
    fs.statSync('test-data')
  } catch {
    createDirectory('test-data/alpha')
    createDirectory('test-data/beta')
    createDirectory('test-data/gamma/eta')
    createDirectory('test-data/gamma/theta')
    fs.writeFileSync('test-data/beta/delta.txt', '')
    fs.writeFileSync('test-data/beta/zeta.txt', '')
    fs.writeFileSync('test-data/gamma/epsilon.txt', '')
    fs.writeFileSync('test-data/gamma/iota.txt', '')
    fs.writeFileSync('test-data/gamma/theta/kappa.txt', '')
  }
}

module.exports = { setupTestData }
