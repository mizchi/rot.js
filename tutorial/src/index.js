import Display from '../../newSrc/display/Display'
import Engine from '../../newSrc/Engine'
import Scheduler from '../../newSrc/scheduler/SimpleScheduler'
import Digger from '../../newSrc/map/Digger'
import RNG from '../../newSrc/rng'
import range from '../../newSrc/utils/range'

class Player {
  constructor(x = 0, y = 0, display) {
    this.x = x
    this.y = y
    this._display = display
    this._draw()
  }

  _draw() {
    this._display.draw(this.x, this.y, '@', '#ff0')
  }
}

class Game {
  constructor() {
    this.display = new Display()
    this.player = null
    this.freeCells = []
    this.map = {}
    document.body.appendChild(this.display.getContainer())
    this._generateMap()
    this._generateBoxes()
    this._drawWholeMap()
    this._createPlayer()
    const scheduler = new Scheduler()
    scheduler.add(this.player, true)
    this.engine = new Engine(scheduler)
    this.engine.start()
  }

  _generateMap() {
    const digger = new Digger()
    digger.create((x, y, value) => {
      if (value) return
      const key = `${x},${y}`
      this.freeCells.push(key)
      this.map[key] = '.'
    })
  }

  _createPlayer() {
    const index = Math.floor(RNG.getUniform() * this.freeCells.length)
    const key = this.freeCells.splice(index, 1)[0]
    const [x, y] = key.split(',')
    this.player = new Player(parseInt(x), parseInt(y), this.display)
  }

  _drawWholeMap() {
    Object.keys(this.map).forEach(vector => {
      const [x, y] = vector.split(',')
      this.display.draw(parseInt(x), parseInt(y), this.map[vector])
    })
  }

  _generateBoxes() {
    range(10).forEach(i => {
      const index = Math.floor(RNG.getUniform() * this.freeCells.length)
      const key = this.freeCells.splice(index, 1)[0]
      this.map[key] = '*'
    })
  }
}

const game = new Game()
