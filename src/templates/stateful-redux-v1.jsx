import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'

// require('./style.scss')

// import ComponentName from './components'

@connect(store => {
    return {

        // props from redux
        //NOTE: example
        // weather: store.weather.weather
    }
})
export default class ComponentName extends React.Component {

    constructor(props) {
        // must call super first for constructor method
        super()
        this.state = {
            data: props
        }
    }

    // TODO: mountings
    // constructor(props)
    componentWillMount()
    // render()
    componentDidMount()

    // TODO: unmounting
    componentWillUnmount()

    // TODO: error handling
    componentDidCatch(error, info)

    // TODO: updating
    componentWillReceiveProps(nextProps)
    shouldComponentUpdate(nextProps, nextState)
    componentWillUpdate(nextProps, nextState)
    // render()
    componentDidUpdate(prevProps, prevState)

    render() {
        return (
            <div>

            </div>
        );
    }

}

ComponentName.propTypes = {
    props: propTypes.types,
}