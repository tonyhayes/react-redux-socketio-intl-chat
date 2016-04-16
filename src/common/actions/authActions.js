import * as types from '../constants/ActionTypes';

export function receiveSocket(socketID) {
    return {
        type: types.RECEIVE_SOCKET,
        socketID
    }
}
