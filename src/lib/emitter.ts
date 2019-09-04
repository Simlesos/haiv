import { isArray } from './utils'

export interface IEvent {
  [key: string]: Array<Function>
}

export default class Emitter {
  private readonly events: IEvent

  constructor() {
    this.events = {}
  }

  on<T>(eventKey: string, listener: (data: T) => void) {
    const activeListeners = this.events[eventKey]
    this.events[eventKey] = [...activeListeners, listener]
  }

  off(eventKey: string, listener: Function) {
    let activeListeners = [...this.events[eventKey]]
    if (isArray(activeListeners)) {
      activeListeners.splice(activeListeners.indexOf(listener), 1)
      this.events[eventKey] = activeListeners
    }
  }

  once<T>(eventKey: string, listener: (data: T) => void) {
    this.on<T>(eventKey, (data: T) => {
      listener(data)
      this.off(eventKey, listener)
    })
  }

  emit<T>(eventKey: string, payload: T) {
    this.events[eventKey].forEach(callback => callback(payload))
  }
}
