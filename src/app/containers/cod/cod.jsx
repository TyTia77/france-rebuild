import React from 'react'
import propTypes from 'prop-types'
import style from './cod.scss'
import { connect } from 'react-redux'
import { CodItem } from '@components'

import abc from 'new-soda'


class cod extends React.Component {
    constructor(props) {
        super()
        this.state = {}
    }

    componentDidMount() {
        // console.log('this.props :', this.props);
        // abc.masterIp.set('192.168.99.200')
        console.error('abc', abc)
        console.error('run', abc.masterIp.run())
        console.error('newsoda', abc.masterIp.get())
    }

    shouldComponentUpdate(nextProps, nextState){
        // console.warn('should update from cod')
        // console.warn('nextProps', nextProps.cod)
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
