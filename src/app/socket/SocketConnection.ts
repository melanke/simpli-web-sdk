import { deserialize } from 'class-transformer'
import { ClassType } from '../../interfaces'
import { $ } from '../../simpli'

export class SocketConnection<T> {
  classType?: ClassType<T>
  socket: WebSocket

  constructor(url: string) {
    let baseURL = $.socket.config.baseURL || ''
    // Ignore last slash (/)
    const match = baseURL.match(/(.*)[^\/$]/g)
    baseURL = match ? match[0] : ''

    this.socket = new WebSocket(`${baseURL}${encodeURI(url)}`)
  }

  as(classType: ClassType<T>) {
    this.classType = classType
    return this
  }

  disconnect() {
    this.socket.close()
  }

  onOpen(callback: (e: Event) => any) {
    this.socket.onopen = function(this: WebSocket, e: Event) {
      callback(e)
    }
  }

  onClose(callback: (e: CloseEvent) => any) {
    this.socket.onclose = function(this: WebSocket, e: CloseEvent) {
      callback(e)
    }
  }

  onError(callback: (e: Event) => any) {
    this.socket.onerror = function(this: WebSocket, e: Event) {
      callback(e)
    }
  }

  onData(callback: (resp: T) => any) {
    const self = this
    this.socket.onmessage = function(this: WebSocket, e: MessageEvent) {
      if (!self.classType) {
        callback(e.data)
        return
      }

      const data = e.data
      const resp = deserialize<T>(self.classType, data)
      callback(resp)
    }
  }

  onOpenPromise() {
    const promiseFunc = (resolve: Function) => {
      this.onOpen((e: Event) => resolve(e))
    }

    return new Promise<void>(promiseFunc)
  }

  onClosePromise() {
    const promiseFunc = (resolve: Function) => {
      this.onClose((e: CloseEvent) => resolve(e))
    }

    return new Promise<void>(promiseFunc)
  }

  onErrorPromise() {
    const promiseFunc = (resolve: Function) => {
      this.onError((e: Event) => resolve(e))
    }

    return new Promise<void>(promiseFunc)
  }

  onDataPromise() {
    const promiseFunc = (resolve: Function) => {
      this.onData((resp: T) => resolve(resp))
    }

    return new Promise<void>(promiseFunc)
  }
}
