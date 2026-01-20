import React, { useEffect, useRef, useState } from 'react'
import { Terminal as Xterm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { useMessagePort } from '../module/runner'
import { useRunner } from '../module'

function debounce(fn: () => void, delay = 60) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}

export default function Terminal() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const messagePort = useMessagePort()

  const [xterm] = useState(() => {
    return new Xterm()
  })

  useEffect(() => {
    xterm.open(containerRef.current)
    const fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)
    const resizeObserver = new ResizeObserver(debounce(() => fitAddon.fit()))
    resizeObserver.observe(containerRef.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!messagePort) return
    xterm.clear()
    // buffer recent output so we can analyze errors
    const recentOutputRef = { current: '' }
    const errorRegex = /(error|exception|traceback|undefined reference|segmentation fault|segfault|cannot find|compilation failed|error:)/i

    const onMessage = (event) => {
      switch (event.data.id) {
        case 'write': {
          const text = String(event.data.data || '')
          // write to terminal
          xterm.writeln(text)

          // append to recent output buffer (keep last ~20k chars)
          recentOutputRef.current = (recentOutputRef.current + '\n' + text).slice(-20000)

          // if output looks like an error, attempt auto-fix
          if (errorRegex.test(text)) {
            triggerAutoFixIfNeeded()
          }
          break
        }
      }
    }

    // Auto-fix state
    const attemptsRef = { current: 0 }
    let isAutoFixing = false

    async function triggerAutoFixIfNeeded() {
      if (isAutoFixing) return
      const { runCode, setCode, codeMap, language } = useRunner.getState()

      // perform up to 3 attempts per error session
      isAutoFixing = true
      while (attemptsRef.current < 3) {
        attemptsRef.current += 1

        // notify user in terminal about auto-fix attempt
        xterm.writeln(`\x1b[1;33mAuto-fix: attempt ${attemptsRef.current}/3 - trying to fix errors...\x1b[0m`)

        // prepare instruction with recent error output
        const instruction = `The code produced errors when executed. Please fix the code so it runs without errors.\n\nError output:\n${recentOutputRef.current}`

        try {
          // clear recent output buffer before requesting and running to avoid stale errors
          recentOutputRef.current = ''

          const response = await fetch('http://localhost:8000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language, instruction, code: codeMap[language] }),
          })

          if (!response.ok) {
            xterm.writeln('\x1b[1;31mAuto-fix: backend returned error, aborting auto-fix attempts.\x1b[0m')
            break
          }

          const data = await response.json()
          const newCode = data.fullCode || null
          if (newCode && newCode !== codeMap[language]) {
            setCode(newCode)
            xterm.writeln('\x1b[1;32mAuto-fix: applied suggested fix to editor. Re-running...\x1b[0m')
          } else {
            xterm.writeln('\x1b[1;33mAuto-fix: AI returned no code changes.\x1b[0m')
          }

          // re-run the code to see if errors persist
          runCode()

          // wait to collect new output (short polling)
          await new Promise((r) => setTimeout(r, 2000))

          // if no error-like text in recent output, consider fixed
          if (!errorRegex.test(recentOutputRef.current)) {
            xterm.writeln('\x1b[1;32mAuto-fix: code appears to be fixed.\x1b[0m')
            // reset attempts for future error sessions
            attemptsRef.current = 0
            isAutoFixing = false
            return
          }

          // otherwise, loop to next attempt
        } catch (err) {
          xterm.writeln(`\x1b[1;31mAuto-fix: error during attempt - ${err?.message || err}\x1b[0m`)
          break
        }
      }

      if (attemptsRef.current >= 3) {
        xterm.writeln('\x1b[1;31mAuto-fix: failed after 3 attempts. Manual intervention required.\x1b[0m')
        // reset attempts so future independent error sessions can try again
        attemptsRef.current = 0
      }
      isAutoFixing = false
    }

    messagePort.onmessage = onMessage
  }, [messagePort])

  return <div className="h-full bg-black" ref={containerRef} />
}
