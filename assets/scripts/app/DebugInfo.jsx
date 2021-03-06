/**
 * DebugInfo.jsx
 *
 * Displays a debugging overlay that shows the current state of the application.
 *
 * @module DebugInfo
 * @requires keypress
 */
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { loseAnyFocus } from '../util/focus'
import './DebugInfo.scss'

function DebugInfo (props) {
  const textareaEl = useRef(null)
  const [isVisible, setVisible] = useState(false)
  const settings = useSelector((state) => state.settings || {})
  const street = useSelector((state) => state.street || {})
  const flags = useSelector((state) => state.flags || {})
  const undo = useSelector((state) => state.undo || {})
  const user = useSelector((state) => state.user || {})

  // Register keyboard input for show (shift-D)
  useEffect(() => {
    window.addEventListener('keydown', showDebugInfo)
    return () => {
      window.removeEventListener('keydown', showDebugInfo)
    }
  })

  // Handle esc keybinding
  useEffect(() => {
    if (isVisible) {
      // Set up keypress listener to close debug window
      window.addEventListener('keydown', hideDebugInfo)
    } else {
      // Remove keypress listener
      window.removeEventListener('keydown', hideDebugInfo)
    }

    // Clean up in case component is unmounted before hiding
    return () => {
      window.removeEventListener('keydown', hideDebugInfo)
    }
  }, [isVisible])

  // Handle DOM effects when show / hide
  // useLayoutEffect helps with timing issues with DOM manipulation
  useLayoutEffect(() => {
    if (isVisible) {
      textareaEl.current.value = JSON.stringify(
        { street, user, settings, flags, undo },
        null,
        2
      )
      textareaEl.current.focus()
      textareaEl.current.select()
      // Prevent scrolling to bottom of textarea after select
      // NOTE: this is still not 100% deterministic, not sure why
      window.setTimeout(() => {
        textareaEl.current.scrollTop = 0
      }, 0)
    } else {
      loseAnyFocus()
    }
  }, [isVisible, settings, street, flags, undo, user])

  function showDebugInfo (event) {
    if (event.key === 'D') {
      setVisible(true)
    }
  }

  function hideDebugInfo (event) {
    if (event.key === 'Esc' || event.key === 'Escape') {
      setVisible(false)
    }
  }

  if (isVisible === true) {
    return (
      <div className="debug-info">
        <textarea readOnly wrap="off" ref={textareaEl} />
      </div>
    )
  }

  // Don't render any DOM if invisible
  return null
}

export default DebugInfo
