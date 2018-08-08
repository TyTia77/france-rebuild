import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import style from './confirm.scss'

class confirm extends React.Component {
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
                {/* <h1>MERCI POUR <br/> POUR VOTRE VISITE ! </h1> */}
                <div className={style.header}>MERCI POUR <br/> POUR VOTRE VISITE ! </div>



                		<div id="order-title">
                            <div id="order-cost-container">
                                <figure>
                                    {/* <img src="/content/COD%20Assets.zip/confirmation-screen/basket.png" alt="Basket" /> */}
                                </figure>
                                <div id="cost-info">
                                    <div id="cost-tagline">
                                            TOTAL À PAYER  <br/>au prochain guichet
                                    </div>
                                    <div id="total-amount">
                                        {/* {{ hackPrice(items) }} */}
                                    </div>
                                </div>
                            </div>
                        </div>


                {
                    this.props.cod.items.map(item => <div className={style.item}>{item.Name}</div>)
                }
            </div>
        )
    }
}

confirm.propTypes = {
    props: propTypes.object,
}

export default connect(store => {
    return {
        cod: store.cod
    }
})(confirm)
