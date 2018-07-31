import React from 'react'
import propTypes from 'prop-types'
import {
    Container,
} from '@containers'

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
            <div className='screen1__container'>
                This is screen one
                <Container />
            </div>
        )
    }
}

screen.propTypes = {
    props: propTypes.object,
}
