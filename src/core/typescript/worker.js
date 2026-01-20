const yellowArrow = '\x1b[1;93m>\x1b[0m '
const green = '\x1b[1;32m'
const normal = '\x1b[0m'

// override console.log for custom output handling
self.console.log = (...args) => {
  const text = args.join(' ')
  port.postMessage({ id: 'write', data: green + text + normal })
}

let port
let babelReadyPromise

async function loadBabel() {
  try {
    port.postMessage({
      id: 'write',
      data: yellowArrow + 'loading babel...',
    })
    self.importScripts('/babel.min.js')
    port.postMessage({
      id: 'write',
      data: yellowArrow + 'babel loaded successfully',
    })
  } catch (error) {
    port.postMessage({
      id: 'write',
      data: 'Error loading Babel: ' + error.message,
    })
    throw error
  }
}

async function onAnyMessage(event) {
  switch (event.data.id) {
    case 'constructor':
      port = event.data.data
      port.onmessage = onAnyMessage
      break

    case 'compileLinkRun':
      if (!babelReadyPromise) {
        babelReadyPromise = loadBabel()
      }
      await babelReadyPromise

      const { data, ...context } = event.data
      // Set any additional context variables on global scope
      for (const key of Object.keys(context)) {
        self[key] = context[key]
      }
      
      port.postMessage({ id: 'write', data: yellowArrow + 'run test.ts' })
      try {
        let transformedCode
        try {
          transformedCode = Babel.transform(data, { 
            filename: 'test.ts', 
            presets: ['typescript', 'env']
          }).code
        } catch (transformError) {
          port.postMessage({ id: 'write', data: 'TypeScript compilation error: ' + transformError.message })
          return
        }
        
        // Execute the transformed code directly
        const fn = new Function(transformedCode)
        fn()
      } catch (error) {
        port.postMessage({ id: 'write', data: 'TypeScript execution error: ' + error.message })
      }
      break
  }
}

self.addEventListener('message', onAnyMessage)
