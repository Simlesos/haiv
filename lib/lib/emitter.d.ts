export interface IEvent {
  [key: string]: Array<Function>
}
export default class Emitter {
  private readonly events
  constructor()
  on<T>(eventKey: string, listener: (data: T) => void): void
  off(eventKey: string, listener: Function): void
  once<T>(eventKey: string, listener: (data: T) => void): void
  emit<T>(eventKey: string, payload: T): void
}
