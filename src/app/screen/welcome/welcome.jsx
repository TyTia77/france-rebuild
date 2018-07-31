import React from 'react'
import propTypes from 'prop-types'

export default class welcome extends React.Component {
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
                <img src={`${window.location.origin}/assets/welcome/background.jpg`} />
            </div>
        )
    }
}

welcome.propTypes = {
    props: propTypes.object,
}
