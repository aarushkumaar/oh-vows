import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

export function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}
