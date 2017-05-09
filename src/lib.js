'use strict'

/**
 * Mixes reducers in order. The resulting reducer function will try all
 * available reducers until a new state is obtained, thus it is recommended
 * to keep the state object immutable.
 * @param {Array.<Function>} reducers functions that accept `state, action`
 * arguments and return new state.S
 * @return {Function} a new reducer function
 */
function mixn (_reducers) {
  const reducers = Array.isArray(_reducers) ? _reducers : Array.from(arguments)

  if (reducers.length === 0) {
    throw new Error('The reducers array needs at least one function')
  }

  reducers.forEach(function (reducer) {
    if (typeof reducer !== 'function') {
      throw new TypeError('All reducers must be a function')
    }
  })

  function reduce (state, action) {
    let newState
    reducers.some(function (fn) {
      newState = fn(state, action)
      return newState !== state
    })
    return newState
  }

  return reduce
}

module.exports = mixn
