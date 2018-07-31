import React from 'react'
import propTypes from 'prop-types'

export default class plv extends React.Component {
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
                <img src={`${window.location.origin}/assets/plv/default.jpg`} />
                {/* TODO: not working */}
                {/* <img src={require('@assets/plv/default.jpg')} /> */}
            </div>
        )
    }
}

plv.propTypes = {
    props: propTypes.object,
}
