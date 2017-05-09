/* global beforeEach, describe, it */
'use strict'
const mixn = require('../src/lib.js')
const { expect } = require('chai')

describe('mixn', () => {
  const ADD = '+'
  const SUBTRACT = '-'
  const MULTIPLY = '*'
  const DIVIDE = '/'

  function reduce1 (state = 0, action) {
    switch (action && action.type) {
      case ADD:
        return state + action.payload
      case SUBTRACT:
        return state - action.payload
      default:
        return state
    }
  }

  function reduce2 (state = reduce1(), action) {
    switch (action && action.type) {
      case MULTIPLY:
        return state * action.payload
      default:
        return state
    }
  }

  function reduce3 (state = reduce1(), action) {
    switch (action && action.type) {
      case ADD:
        return state + action.payload * 2
      case DIVIDE:
        return state / action.payload
      default:
        return state
    }
  }

  it('fails when no functions', () => {
    expect(() => mixn()).to.throw(/at least one function/)
  })

  it('fails when some other type passed', () => {
    expect(() => mixn(1)).to.throw(/must be a function/)
  })

  it('works with or without array', () => {
    expect(mixn([reduce1, reduce2, reduce3])).to.be.a('function')
    expect(mixn(reduce1, reduce2, reduce3)).to.be.a('function')
  })

  describe('reducing', () => {
    let reduce, state
    beforeEach(() => {
      reduce = mixn(reduce1, reduce2, reduce3)
      state = reduce()
      expect(state).to.equal(0)
    })

    it('tries reducers until state changes', () => {
      state = reduce(state, { type: ADD, payload: 2 })
      expect(state).to.equal(2)
      state = reduce(state, { type: SUBTRACT, payload: 3 })
      expect(state).to.equal(-1)
      state = reduce(state, { type: MULTIPLY, payload: 4 })
      expect(state).to.equal(-4)
      state = reduce(state, { type: DIVIDE, payload: 5 })
      expect(state).to.equal(-0.8)
    })
  })
})
