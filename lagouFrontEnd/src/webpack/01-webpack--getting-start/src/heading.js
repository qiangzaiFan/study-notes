export default () => {
  const element = document.createElement('h2')
  element.textContent = 'hello world'
  element.addEventListener('click', () => {
    alert('Hello Webpack')
  })
  return element
}
