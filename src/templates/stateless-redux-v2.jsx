import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { functionName } from 'actions'

// style
// require('./style.scss')

// component
// import ComponentName from 'module'

const ComponentName = ({ props, nameOfPropFromStore, dispatch }) =>
    <div>

    </div>

ComponentName.propTypes = {
    // types = string, array, object, number, bool, func
    // props: propTypes.type
}

export default connect(store => {
    return {
        //NOTE: example
        nameOfPropFromStore: store.weather.weather
    }
})(ComponentName)