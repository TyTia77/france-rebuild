import React from 'react'
import propTypes from 'prop-types'

export default class screen extends React.Component {
    constructor(props) {
        super()
        this.state = {}
    }

    componentDidMount() {
        // console.log('this.props :', this.props);
    }

    render() {
        return (
            <div className='screen2__container'>
                This is screen two
            </div>
        )
    }
}

screen.propTypes = {
    props: propTypes.object,
}
