export function updateCod(data) {
    return function (dispatch) {
        dispatch({ type: 'UPDATE_COD' })
        dispatch({ type: 'UPDATE_COD_FULFILLED', payload: data, tyTest: 'test' })
        // dispatch({ type: 'UPDATE_COD_REJECTED', payload: 'cod update rejected' })
    }
}
