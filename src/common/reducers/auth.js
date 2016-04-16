import {
    RECEIVE_SOCKET
} from '../constants/ActionTypes';

const initialState = {
    loaded: false,
    user: {
        username: null,
        id: null,
        socketID: null
    }
};

export default function auth(state = initialState, action = {}) {
    switch (action.type) {

        case RECEIVE_SOCKET:
            return {
                ...state,
                user: {...state.user,
                    socketID: action.socketID
                }
            };
        default:
            return state;
    }
}
