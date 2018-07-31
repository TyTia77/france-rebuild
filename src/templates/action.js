//TODO: fix
import getWeather from 'Helpers/weather'

export function fetchWeather() {

    return function (dispatch) {
        dispatch({ type: 'FETCH_WEATHER' })

        getWeather().then(result =>
            dispatch({ type: 'FETCH_WEATHER_FULFILLED', payload: result })
            , () => dispatch({ type: 'FETCH_WEATHER_REJECTED', payload: 'err' })
        )
    }
}