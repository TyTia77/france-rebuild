import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'

// style
// require('./style.scss')

// component
// import ComponentName from 'module'

const ComponentName = ({ props }) =>
    <div>

    </div>

ComponentName.propTypes = {
    // types = string, array, object, number, bool, func
    // props: propTypes.type
}

// state from redux
const mapStateToProps = (state, ownProps) => {
    console.log('state mapStateToProps', state)
    console.log('ownProps mapStateToProps', ownProps)
}

// dispatch function to dispatch an action
const mapDispatchToProps = (dispatch, ownProps) => {
    // console.log('dispatch mapDispatchToProps', dispatch)
    console.log('ownProps mapDispatchToProps', ownProps)

    //NOTE: examples
    // dispatch(fetchWeather())
    // onClick: () => dispatch(setVisibilityFilter(ownProps.filter))
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentName)