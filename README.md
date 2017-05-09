# mixn [![BuildStatus][1]][2]

Mixes reducers in order. Allows easy extension of redux reducer functions.
Tries each one until the state changes. No dependencies.

# Usage

```javascript
const mixn = require('mixn')

function reduce1 (state = 0, action) {
  switch (action && action.type) {
    case 'ADD':
      return state + action.payload
    case 'SUBTRACT':
      return state - action.payload
    default:
      return state
  }
}

function reduce2 (state = reduce1(), action) {
  switch (action && action.type) {
    case 'MULTIPLY':
      return state * action.payload
    default:
      return state
  }
}

function reduce3 (state = reduce1(), action) {
  switch (action && action.type) {
    case 'ADD':
      return state + action.payload * 2
    case 'DIVIDE':
      return state / action.payload
    default:
      return state
  }
}

const reduce = mixn([
  reduce1,
  reduce2,
  reduce3
])

reduce(10, { type: 'MULTIPLY', payload: 11 })
// 110
```

# License

[MIT][3]

Copyright 2017 Jerko Steiner

[1]: https://travis-ci.org/jeremija/mixn.svg?branch=master
[2]: https://travis-ci.org/jeremija/mixn
[3]: LICENSE
