import React from 'react'
import propTypes from 'prop-types'
import {
    Component,
} from '@components'

export default class container extends React.Component {
    constructor(props) {
        super()
        this.state = {}
    }

    componentDidMount() {
        // console.log('this.props :', this.props);
    }

    render() {
        return (
            <div class='container__container'>
                This is a container
                <Component />
            </div>
        )
    }
}

container.propTypes = {
    props: propTypes.object,
}
