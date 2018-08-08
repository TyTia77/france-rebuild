import React from 'react'
import propTypes from 'prop-types'
import style from './composition.scss'

import { CompositionRow } from '@containers'

export default class composition extends React.Component {
    constructor(props) {
        super()
        this.state = {}
    }

    componentDidMount() {
        // console.log('this.props :', this.props);
    }

    render() {
        return (
            <div className={style['container']}>
                <div className={style.header}>
                    COMPOSEZ VOITRE MENU <br/> BEST OF
                </div>

                <CompositionRow />
                <CompositionRow />
                <CompositionRow />
            </div>
        )
    }
}

composition.propTypes = {
    props: propTypes.object,
}
