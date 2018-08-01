import React from 'react'
import propTypes from 'prop-types'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { addListener } from '@util/socket'
import { connect } from 'react-redux'
import { updateCod } from '../actions'

import {
    Screen1, Screen2, Welcome, Composition, ProductRange, Range, Upsell, Upsize, Plv, Confirm, Layout
} from '@screens'

class router extends React.Component {

    constructor(props) {
        // must call super first for constructor method
        super()
        this.state = {
            data: props
        }
    }

    // TODO: mountings
    // constructor(props)
    componentWillMount(){
        this.props.dispatch(updateCod([1]))
        this.addEvents()
        // this.props.dispatch(actionName())
        // this.props.dispatch(actionName())
    }
    // render()
    // componentDidMount()

    // TODO: unmounting
    // componentWillUnmount()

    // TODO: error handling
    // componentDidCatch(error, info)

    // TODO: updating
    // componentWillReceiveProps(nextProps)
    shouldComponentUpdate(nextProps, nextState){
        console.warn('should update')
        console.warn('nextProps', nextProps)
    }

    componentWillUpdate(nextProps, nextState){
        console.warn('willupdate')
        console.warn('nextProps', nextProps)
    }

    addEvents(){
        // console.warn('adding events')
        addListener('switchboard.vehicle-detected', this.welcome.bind(this))
        addListener('switchboard.wwc.reset', this.gamme.bind(this))
        addListener('switchboard.update', this.posUpdate.bind(this))
        addListener('notification', this.notifi.bind(this))
    }

    welcome(){
        this.open('welcome')
    }

    gamme(){
        this.open('')
    }

    posUpdate(item, price){
        console.warn('pos update', item, price)
        // console.warn('dispatch', this.props.dispatch)
        this.props.dispatch(updateCod(item))
        this.open('layout')
    }

    posConfirm(item, price){
        this.open('confirm')
    }

    notifi(data){
        let payload = data.data.attributes.payload.data.eCOCsaleInfo
        let orderstate = payload.Header[0].$.OrderState
        let order = payload.Order[0].Item
        let totalPrice = payload.Order[0].$
        console.warn('header', payload.Header[0].$)
        console.warn('order', payload.Order[0])
        console.warn('notifi', orderstate)

        switch(orderstate){
            case '1':
                this.posUpdate(this.itemClean(order), totalPrice)
                break

            case '2':
                this.posConfirm(order, totalPrice)
                break

            case '3':
                this.posFinish()
                break
        }
    }

    open(screen){
        window.open(`#/${screen}`, '_self')
    }

    itemClean(data){
        return data.map(item => {
            console.warn('item', item)


            const abc = {
                attributes: {},
                code: item.$.Cod,
                displayName: item.$.Name.split('/').reverse()[0],
                name: item.$.Name,
                extras: [],
                price: item.$.Price,
                qtyPromo: 0,
                quantity: item.$.Qty,
                selected: false,
                showQuantity: true,
                subProducts: [],
                voided: item.$.QtyVoided == '0' ? false : true,
            }

            console.warn('abc', abc)


            return item.$
        })
    }

    posFinish(data){
        console.warn('pos finish')
        this.open('')
    }

    render() {
        return (
            <Router history={hashHistory}>
                <Route path='/' component={Plv} />
                <Route path='screen1' component={Screen1} />
                <Route path='screen2' component={Screen2} />
                <Route path='welcome' component={Welcome} />
                <Route path='confirm' component={Confirm} />

                <Route path='layout' component={Layout}>
                    <IndexRoute component={ProductRange}></IndexRoute>
                    <Route path='composition' component={Composition} />
                    <Route path='range' component={Range} />
                </Route>
            </Router>
        )
    }

}

router.propTypes = {
    props: propTypes.types,
}

export default connect()(router)
