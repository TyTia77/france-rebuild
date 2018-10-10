let initialState = {
    datasources: false,
    fetching: false,
    fetched: false,
    error: null,
}

export const datasource = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_DATASOURCE': {
            return { ...state, fetching: true }
        }

        case 'FETCH_DATASOURCE_FULFILLED': {
            return {
                ...state,
                fetching: false,
                fetched: true,
                datasources: action.payload
            }
        }

        case 'FETCH_DATASOURCE_REJECTED': {
            return { ...state, fetching: false, error: action.payload }
        }

        default:
            return state
    }
}
