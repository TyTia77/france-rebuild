import React from 'react'
import propTypes from 'prop-types'
import style from './composition.scss'

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
                menu composition screen
            </div>
        )
    }
}

composition.propTypes = {
    props: propTypes.object,
}
