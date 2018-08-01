import React from 'react'
import propTypes from 'prop-types'
import style from './cod.scss'
import { connect } from 'react-redux'

class cod extends React.Component {
    constructor(props) {
        super()
        this.state = {}
    }

    componentDidMount() {
        // console.log('this.props :', this.props);
    }

    shouldComponentUpdate(nextProps, nextState){
        // console.warn('should update from cod')
        // console.warn('nextProps', nextProps.cod)
        return true
    }

    render() {
        return (
            <div className={style.container}>
                <div className={style.cod__header}>
                    <div className="cod__header__bag"></div>
                    <div className="cod__header__title">VOTRE COMMANDE</div>
                    <div className="cod__header__price"></div>
                </div>
                <div className={style.cod__body}>
                    {this.props.cod.items.map(item =>
                        <div className={style['cod__body__row']}>
                            <span className={style['cod__body__row__items']}>{item.Qty}</span>
                            <span className={style['cod__body__row__items']}>{item.Name}</span>
                            <span className={style['cod__body__row__items']}>{item.Price}</span>
                        </div>
                    )}
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
