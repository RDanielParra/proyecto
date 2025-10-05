const $ = selector => document.querySelector(selector)

const $count = $('#count')
const $button = $('button')

$button.addEventListener('click', () => {
  const count = +$count.innerHTML
  $count.innerHTML = (count + 1).toString()
})

window.api.onUpdateTheme((event, theme) => {
    const root = document.documentElement
    
    root.style.setProperty('--scheme', theme)
  }
)

