import React from 'react'
import propTypes from 'prop-types'
import style from './cod-item.scss'
// style
// require('./style.scss')

// component
// import ComponentName from 'module'

const codItem = ({ items }) =>
    <div className={style['container']}>
        <div className={style['container__items']}>{items.quantity}</div>
        <div className={style['container__items']}>{items.name}</div>
        <div className={style['container__items']}>{items.price}</div>
    </div>

codItem.propTypes = {
    // types = string, array, object, number, bool
    items: propTypes.object.isRequired
}

export default codItem
