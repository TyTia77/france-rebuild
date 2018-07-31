import React from 'react'
import propTypes from 'prop-types'
import style from './component.scss'

const component = ({item}) =>
    <div class="component__container">
        This is a component
    </div>

component.propTypes = {
    item: propTypes.object,
}

export default component
