import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { addListener } from '@util/socket'

import {
    Screen1, Screen2, Welcome, Composition, ProductRange, Range, Upsell, Upsize, Plv, Confirm, Layout
} from '@screens'

const router = () => (
    <Router history={hashHistory}>
        <Route path='/' component={Plv} />
        <Route path='screen1' component={Screen1} />
        <Route path='screen2' component={Screen2} />
        <Route path='welcome' component={Welcome} />
        <Route path='confirm' component={Confirm} />

        {/* with cod */}
        <Route path='composition' component={Composition} />
        <Route path='range' component={Range} />
        <Route path='product-range' component={ProductRange} />

        {/* TODO: remove testing */}
        <Route path='layout' component={Layout}>
            <IndexRoute component={ProductRange}></IndexRoute>
            <Route path='composition' component={Composition} />
            <Route path='range' component={Range} />
        </Route>
    </Router>
)

// add events
addListener('switchboard.vehicle-detected', welcome)
addListener('switchboard.wwc.reset', gamme)
addListener('switchboard.update', posUpdate)
addListener('notification', notifi)

function welcome(){
    open('welcome')
}

function gamme(){
    open('/')
}

function notifi(data){
    let payload = data.data.attributes.payload.data.eCOCsaleInfo
    let orderstate = payload.Header[0].$.OrderState
    let order = payload.Order[0].Item
    let totalPrice = payload.Order[0].$
    console.warn('notifi', orderstate)

    switch(orderstate){
        case '1':
            posUpdate(itemClean(order), totalPrice)
            break

        case '2':
            posConfirm(order, totalPrice)
            break

        case '3':
            posFinish()
            break
    }
}

function itemClean(data){
    return data.map(item => item.$)
}

function posUpdate(item, price){
    console.warn('pos update', item, price)
    open('layout')
}

function posConfirm(item, price){
    console.warn('pos confirm', item, price)
    open('confirm')
}

function posFinish(data){
    console.warn('pos finish')
    open('/')
}

function open(screen){
    window.open(`#/${screen}`, '_self')
}

export default router
