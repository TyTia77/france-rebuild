import React from 'react'
import propTypes from 'prop-types'
import style from './cod.scss'
import { connect } from 'react-redux'
import { CodItem } from '@components'

// import newSoda from 'new-soda'
import newSoda from 'lms-connect'


class cod extends React.Component {
    constructor(props) {
        super()
        this.state = {}
    }

    componentDidMount() {
        console.info('this.props :', this.props)
        // console.info('newSoda', newSoda)
        // newSoda.setup('192.168.99.200')
        // newSoda.listener.add('switchboard.vehicle-detected', this.cb)
        // newSoda.cod.onComplete(this.tycomplete)
        // newSoda.cod.onUpdate(this.tyupdate)
        // newSoda.cod.onConfirm(this.tyconfirm)
    }

    cb(){
        console.error('cb called')
    }

    tycomplete(){
        console.error('ty complete')
    }

    tyupdate(data, total){
        console.error('ty update', data)
    }

    tyconfirm(data, total){
        console.error('ty confirm', data)
    }

    shouldComponentUpdate(nextProps, nextState){
        console.info('should update from cod')
        console.info('nextProps', nextProps.cod)
        return true
    }

    render() {
        return (
            <div className={style['container']}>
                <div className={style['cod__header']}>
                    <div className={style['cod__header__bag']}>
                        <span className={style['cod__header__bag__count']}>4</span>
                        <img
                            className={style['cod__header__bag__image']}
                            src={`${window.location.origin}/assets/cod/bag.png`} />
                    </div>
                    <div className={style['cod__header__title']}>VOTRE COMMANDE</div>
                    <div className={style['cod__header__price']}>total</div>
                </div>
                <div className={style['cod__body']}>
                    <div className={style['cod__body__left']}>
                        {
                            this.props.cod.items.slice(9).map(item => <CodItem items={item}/>)
                        }
                    </div>
                    <div className={style['cod__body__right']}>
                        {
                            this.props.cod.items.slice(0,9).map(item => <CodItem items={item}/>)
                        }
                    </div>
                </div>
            </div>
        )
    }
}

cod.propTypes = {
    props: propTypes.object,
}

export default connect(store => {
    return {
        cod: store.cod
    }
})(cod)
