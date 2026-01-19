const fs = require('fs')
const path = require('path')

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Ensure pyodide directory exists
const pyodideDir = path.join(publicDir, 'pyodide')
if (!fs.existsSync(pyodideDir)) {
  fs.mkdirSync(pyodideDir, { recursive: true })
}

// Copy Babel standalone
const babelSource = path.join(__dirname, '..', 'node_modules', '@babel', 'standalone', 'babel.min.js')
const babelDest = path.join(publicDir, 'babel.min.js')
if (fs.existsSync(babelSource)) {
  fs.copyFileSync(babelSource, babelDest)
  console.log('✓ Copied babel.min.js to public/')
} else {
  console.warn('⚠ babel.min.js not found in node_modules')
}

// Copy Pyodide files
const pyodideSource = path.join(__dirname, '..', 'node_modules', 'pyodide')
const pyodideFiles = [
  'pyodide.js',
  'pyodide.js.map',
  'pyodide.mjs',
  'pyodide.mjs.map',
  'pyodide.asm.js',
  'pyodide.asm.wasm',
  'pyodide.d.ts',
  'ffi.d.ts',
  'python_stdlib.zip',
  'pyodide-lock.json',
  'package.json',
]

if (fs.existsSync(pyodideSource)) {
  pyodideFiles.forEach((file) => {
    const source = path.join(pyodideSource, file)
    const dest = path.join(pyodideDir, file)
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest)
    }
  })
  console.log('✓ Copied Pyodide files to public/pyodide/')
} else {
  console.warn('⚠ Pyodide not found in node_modules')
}

console.log('Asset copying complete!')
