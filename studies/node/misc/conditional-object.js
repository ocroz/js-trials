const isDev = true

const myObject = {
  [isDev ? 'toto' : 'titi']: {
    tata: true
  },

  module: {
    rules: [
      {
        test: true
      }
    ]
  },

  plugins: [
    'plugin-a',
    'plugin-b',
    (isDev
      ? undefined
      : 'plugin-c'
    ),
    'plugin-d'
  ]
}

const thisObject = new function () {
  return {
    toto: 'tata', titi: 'tutu'
  }
}()

console.log(myObject)
console.log(thisObject)
