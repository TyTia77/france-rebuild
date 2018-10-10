import $ from 'jquery'

export const datasource = () => dispatch => {
    dispatch({ type: 'FETCH_DATASOURCE' })

    let sources = window.SB.Data._sources

    let results = sources.reduce((list, next) => {
        list[next.slice(0, next.indexOf('.csv'))] = clean(window.SB.Data.like(next).single())
        return list
    }, {})

    $.isEmptyObject(results)
        ? dispatch({ type: 'FETCH_DATASOURCE_REJECTED', payload: 'no results' })
        : dispatch({ type: 'FETCH_DATASOURCE_FULFILLED', payload: results})
}

function clean(array){
    array.map(item => {
        Object.keys(item).forEach(key => {
            if (key.includes('col')){
                delete item[key]
            }
        })
    })

    return array
}
