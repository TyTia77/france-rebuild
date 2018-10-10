import React from 'react'
import propTypes from 'prop-types'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { addListener } from '@util/socket'
import { connect } from 'react-redux'
import { updateCod, datasource } from '../actions'
// import newSoda from 'new-soda'
import SBConnect from 'lms-connect'

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
        this.props.dispatch(datasource())

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
        // console.warn('should update')
        // console.warn('nextProps', nextProps)
    }

    componentWillUpdate(nextProps, nextState){
        // console.warn('willupdate')
        // console.warn('nextProps', nextProps)
    }

    addEvents(){
        // console.warn('adding events')

        console.error('SBConnect', SBConnect)
        SBConnect.setup('192.168.99.200')
        // SBConnect.setup('localhost')
        // SBConnect.setup('10.0.3.100')
        SBConnect.listener.add('switchboard.vehicle-detected', this.welcome.bind(this))
        SBConnect.cod.onComplete(this.posFinish.bind(this))
        SBConnect.cod.onUpdate(this.posUpdate.bind(this))
        SBConnect.cod.onConfirm(this.posConfirm.bind(this))

        // newSoda.lms.cod.onPosOpen()

        addListener('notification', this.notifi.bind(this))
        // addListener('testing', function(data){
        //     console.warn('testing called', data)
        // })
        // setTimeout(() => {
        //     newSoda.lms.send('testing', 'abcbac')
        // }, 2000)

        // addListener('switchboard.vehicle-detected', this.welcome.bind(this))
        // addListener('switchboard.wwc.reset', this.gamme.bind(this))
        // addListener('switchboard.update', this.posUpdate.bind(this))
        // addListener('notification', this.notifi.bind(this))
    }

    welcome(data){
        console.info('data detect vehicle', data)
        this.open('welcome')
    }

    gamme(){
        this.open('')
    }

    rules(){
        let list = {}
        const ruleList = {
            range: {
                name: 'name',
                journeyDefault: ['layout/range',],
                codes: [
                    'burger range',
                    'drink range',
                ]
            },

            bestOf: {
                name: 'best of',
                journeyDefault: ['layout/composition', 'layout/upsize'],
                codes: ['2506'],
            },

            maxiBestOf: {
                name: 'maxi best of',
                journeyDefault: ['layout/composition'],
                codes: ['2581'],
            },

            golden: {
                name: 'golden',
                journeyDefault: ['layout/composition'],
                codes: ['3410'],
            },
        }

        for (let prop in ruleList){
            list[prop] = Object.assign({}, ruleList[prop])
        }

        return list
    }

    findJourney(rules, code){
        for (let prop in rules){
            if (rules[prop].codes.indexOf(code) > -1){
                return rules[prop]
            }
        }

        return false
    }

    posUpdate(data){
        console.error('update', data)
        let rules = this.rules()
        let selected = data.items[data.items.length - 1]

        let journey = this.findJourney(rules, selected.code)

        console.warn('rules', journey)

        this.props.dispatch(updateCod(data.items))

        if (journey){
            this.open(journey.journeyDefault[0])
            return
        }

        this.open('layout')
    }

    posConfirm(item, price){
        console.error('confirm', item)
        this.open('confirm')
    }


    notifi(data){
        let payload = data.data.attributes.payload.data.eCOCsaleInfo
        let orderstate = payload.Header[0].$.OrderState
        let order = payload.Order[0].Item
        let totalPrice = payload.Order[0].$

        // console.error('sb from france', SB)
        // console.warn('header', payload.Header[0].$)
        // console.warn('order notifi', payload.Order[0])
        // console.warn('notifi', orderstate)
        // console.warn('tester', arguments)
        console.warn('tester1', data)

        // switch(orderstate){
        //     case '1':
        //         this.posUpdate(this.itemClean(order), totalPrice)
        //         break

        //     case '2':
        //         this.posConfirm(order, totalPrice)
        //         break

        //     case '3':
        //     case '5':
        //         this.posFinish()
        //         break
        // }
    }
    open(screen){
        window.open(`#/${screen}`, '_self')
    }

    itemClean(data){
        return this.findSelected(data.map(item => {
            item.$.Code = item.$.Cod
            item.$.Qty = String(Math.abs(item.$.QtyVoided - item.$.Qty))
            item.$.subProducts = []
            item.$.extras = []

            delete item.$.Cod
            delete item.$.QtyVoided

            if (item.hasOwnProperty('Grill')){
                item.$.subProducts = item.Grill.filter(grill => !grill.$.hasOwnProperty('ModifiedQty')).map(grill => grill.$)
                item.$.extras = item.Grill.filter(grill => grill.$.hasOwnProperty('ModifiedQty')).map(grill => grill.$)

                item.$.subProducts = item.$.subProducts.length
                    ? sortSubProducts(item.$.subProducts)
                    : item.$.subProducts
            }

            return item.$
        }))
    }

    findSelected(products){
        console.warn('products', products)


        return products
    }

    posFinish(data){
        console.error('pos finish', data)
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
                    <Route path='upsize' component={Upsize} />
                    <Route path='upsell' component={Upsell} />
                </Route>
            </Router>
        )
    }
}

router.propTypes = {
    props: propTypes.types,
}

export default connect(store => {
    console.info('store', store)
    console.info('process', window.location)
    return {

    }
})(router)
