# mixn [![BuildStatus][1]][2]

Useful functinos for redux reducers. Allows easy extension of redux reducer
functions. Tries each one until the state changes. No dependencies.

# Usage

## mixn

Mixes reducers in order. The resulting reducer function will try all available
reducers until a new state is obtained, thus it is recommended to keep the
state object immutable.

```javascript
const { mixn } = require('mixn')

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
## muxn

Muxes all handler objects and creates a reducer function. A handler object is a
dictionary, which contains `action.type` as key and a reducer `function(state,
action)` * as value. If two handlers each contain a reducer for a specific
action, the last one in order takes precedence.

```javascript
const { muxn } = require('mixn')
const reduce = muxn({
  ADD: (state, action) => state + action.payload
  SUBTRACT: (state, action) => state - action.payload
}, {
  DIVIDE: (state, action) => state / action.payload
})
reduce(10, { type: 'DIVIDE', payload: 2 })
// 5
```

## withDefaultState

Wraps a reducer and sets a default state if it is `undefined`.

```javascript
const { muxn, withDefaultState } = require('mixn')
const handler = {
  ADD: (state, action) => state + action.payload
}
const reduce = withDefaultState(muxn(handler), 10)
reduce()
// 10
```

# License

[MIT][3]

Copyright 2017 Jerko Steiner

[1]: https://travis-ci.org/jeremija/mixn.svg?branch=master
[2]: https://travis-ci.org/jeremija/mixn
[3]: LICENSE
