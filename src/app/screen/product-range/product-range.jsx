import React from 'react'
import propTypes from 'prop-types'
import style from './product-range.scss'

export default class productRange extends React.Component {
    constructor(props) {
        super()
        this.state = {}
    }

    componentDidMount() {
        // console.log('this.props :', this.props);
    }

    render() {
        return (
            <div className='screen1__container'>
                <div className={style.header}>
                    AUJOURD'HUI <br/> NOUS VOUS PROPOSONS
                </div>

                <div className={style.hero}>
                    <img src="../../../assets/product-range/50bigmac.jpg" />
                </div>

                <div className={style.row}>
                    <div className={style.row__boxes}></div>
                    <div className={style.row__boxes}></div>
                    <div className={style.row__boxes}></div>
                    <div className={style.row__boxes}></div>
                    <div className={style.row__boxes}></div>
                </div>

                <div className={style.row}>
                    <div className={style.row__boxes}></div>
                    <div className={style.row__boxes}></div>
                    <div className={style.row__boxes}></div>
                    <div className={style.row__boxes}></div>
                    <div className={style.row__boxes}></div>
                </div>

                <div className={style.disclaimer}>
                    disclaimer
                </div>

            </div>
        )
    }
}

productRange.propTypes = {
    props: propTypes.object,
}
