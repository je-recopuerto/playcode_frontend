self.importScripts('/pyodide/pyodide.js')

const yellowArrow = '\x1b[1;93m>\x1b[0m '
const green = '\x1b[1;32m'
const normal = '\x1b[0m'

// override the default behaviour of pyodide
self.console.log = (text) =>
  port.postMessage({ id: 'write', data: green + text + normal })

let port
let pyodideReadyPromise

async function loadPyodideAndPackages() {
  port.postMessage({
    id: 'write',
    data: yellowArrow + 'loading pyodide...',
  })

  self.pyodide = await loadPyodide({
    indexURL: '/pyodide/',
  })
}

async function onAnyMessage(event) {
  switch (event.data.id) {
    case 'constructor':
      port = event.data.data
      port.onmessage = onAnyMessage
      break

    case 'compileLinkRun':
      if (!pyodideReadyPromise) {
        pyodideReadyPromise = loadPyodideAndPackages()
      }
      await pyodideReadyPromise

      const { data, ...context } = event.data
      for (const key of Object.keys(context)) {
        self[key] = context[key]
      }
      port.postMessage({ id: 'write', data: yellowArrow + 'pyodide test.py' })
      try {
        await self.pyodide.loadPackagesFromImports(data)
        await self.pyodide.runPython(data)
      } catch (error) {
        port.postMessage({ id: 'write', data: error.message })
      }
      break
  }
}

self.addEventListener('message', onAnyMessage)
