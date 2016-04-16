import { CHANGE_LANGUAGE } from '../constants/ActionTypes';

const initialState = {
    locale: 'en',
    id: 0
};

export default function activeLanguage(state = initialState, action) {
    switch (action.type) {
        case CHANGE_LANGUAGE:
            return {
                locale: action.locale.name,
                id: action.locale.id
            };

        default:
            return state;
    }
}
