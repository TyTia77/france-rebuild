import React from 'react'
import propTypes from 'prop-types'
import style from './cod.scss'

export default class cod extends React.Component {
    constructor(props) {
        super()
        this.state = {}
    }

    componentDidMount() {
        // console.log('this.props :', this.props);
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
                    cod body
                </div>
            </div>
        )
    }
}

cod.propTypes = {
    props: propTypes.object,
}
