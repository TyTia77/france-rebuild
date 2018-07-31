export function updateCod(data) {
    return function (dispatch) {
        dispatch({ type: 'UPDATE_COD' })
        dispatch({ type: 'UPDATE_COD_FULFILLED', payload: data })
        //dispatch({ type: 'UPDATE_COD_REJECTED', payload: 'drink bug not found' })
    }
}
