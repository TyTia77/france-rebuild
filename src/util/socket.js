import socketIo from '@vender/socket.io'

// supermaster url, socket options
var socket = socketIo('http://192.168.99.200:22599', {resource: 'message'})

export function addListener(message, callback){
    socket.on(message, callback)
}

export function removeListener(message, callback){
    callback && (callback instanceof Function)
        ? socket.removeListener(message, callback)
        : socket.removeAllListeners(message)
}
