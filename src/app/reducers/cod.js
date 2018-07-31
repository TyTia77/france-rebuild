let initialState = {
    items: [],
    fetching: false,
    fetched: false,
    error: null,
}

export function cod(state = initialState, action){
    switch (action.type) {
        case 'UPDATE_COD': {
            return { state, fetching: true }
        }
        case 'UPDATE_COD_REJECTED': {
            return { state, fetching: false, error: action.payload }
        }
        case 'UPDATE_COD_FULFILLED': {
            return {
                state,
                fetching: false,
                fetched: true,
                items: action.payload
            }
        }
    }

    return state
}
