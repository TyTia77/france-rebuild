import React from 'react'
import propTypes from 'prop-types'

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
                product rage screen
            </div>
        )
    }
}

productRange.propTypes = {
    props: propTypes.object,
}
