'use strict'

/**
 * Mixes reducers in order. The resulting reducer function will try all
 * available reducers until a new state is obtained, thus it is recommended
 * to keep the state object immutable.
 * @param {Array.<Function>} reducers functions that accept `state, action`
 * arguments and return new state.
 * @return {Function} a new reducer function
 */
function mixn (_reducers) {
  var reducers = Array.isArray(_reducers) ? _reducers : Array.from(arguments)

  if (reducers.length === 0) {
    throw new Error('The reducers array needs at least one function')
  }

  reducers.forEach(function (reducer) {
    if (typeof reducer !== 'function') {
      throw new TypeError('All reducers must be a function')
    }
  })

  function reduce (state, action) {
    var newState
    reducers.some(function (fn) {
      newState = fn(state, action)
      return newState !== state
    })
    return newState
  }

  return reduce
}

/**
 * Muxes all handler objects and creates a reducer function. A handler object
 * is a dictionary, which contains `action.type` as key and a reducer
 * `function(state, action)` * as value. If two handlers each contain a reducer
 * for a specific action, the last one in order takes precedence.
 * @param {Array.<Object>} handlers handler objects
 * @return {Function} a new reducer function
 */
function muxn (_handlers) {
  var handlers = Array.isArray(_handlers) ? _handlers : Array.from(arguments)

  if (handlers.length === 0) {
    throw new Error('The handlers array needs at least one function')
  }

  var allHandlers = {}
  handlers.forEach(function (handler) {
    if (typeof handler !== 'object') {
      throw new TypeError('All handlers must be an object')
    }
    Object.keys(handler).forEach(function (actionType) {
      var handle = handler[actionType]
      if (typeof handle !== 'function') {
        throw new TypeError('Every handler value must be a function')
      }
      allHandlers[actionType] = handle
    })
  })

  function reduce (state, action) {
    var handle = allHandlers[action && action.type]
    return handle ? handle(state, action) : state
  }

  return reduce
}

/**
 * Sets a default state for a reducer in case it is `undefined`
 * @param {Function} reduce reducer function
 * @param {*} defaultState  state to set if it is `undefined`
 * @return {Function} wrapped reducer function
 */
function withDefaultState (defaultState) {
  return function (reduce) {
    return function reduceWithDefaultState (state, action) {
      if (typeof state === 'undefined') {
        state = defaultState
      }
      return reduce(state, action)
    }
  }
}

module.exports = {
  mixn: mixn,
  muxn: muxn,
  withDefaultState: withDefaultState
}
