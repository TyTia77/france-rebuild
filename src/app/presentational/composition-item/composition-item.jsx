import React from 'react'
import propTypes from 'prop-types'
import style from './composition-item.scss'

// style
// require('./style.scss')

// component
// import ComponentName from 'module'

const compositionItem = ({ props }) =>
    <div className={style.item}>
        item
    </div>

compositionItem.propTypes = {
    // types = string, array, object, number, bool
    // props: propTypes.type
}

export default compositionItem
