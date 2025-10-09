const $ = selector => document.querySelector(selector)

window.api.onUpdateTheme((event, theme) => {
    const root = document.documentElement
    
    root.style.setProperty('--scheme', theme)
  }
)