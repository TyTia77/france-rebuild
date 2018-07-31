//TODO: fix
export function functionName(
    state = {
        propName: 'cold',
        fetching: false,
        fetched: false,
        error: null
    },
    action
) {
    switch (action.type) {
        case 'FETCH_WEATHER': {
            return { ...state, fetching: true }
        }
        case 'FETCH_WEATHER_REJECTED': {
            return { ...state, fetching: false, error: action.payload }
        }
        case 'FETCH_WEATHER_FULFILLED': {
            return {
                ...state,
                fetching: false,
                fetched: true,
                propName: action.payload
            };
        }
    }

    return state;
}