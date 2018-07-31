import React from 'react'
import propTypes from 'prop-types'

export default class confirm extends React.Component {
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
                <h1>CONFIRM SCREEN</h1>
            </div>
        )
    }
}

confirm.propTypes = {
    props: propTypes.object,
}
