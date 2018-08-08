import React from 'react'
import propTypes from 'prop-types'
import style from './composition-row.scss'
import { CompositionItem } from '@components'

export default class compositionRow extends React.Component {

    constructor(props) {
        // must call super first for constructor method
        super()
        this.state = {
            data: props
        }
    }

    render() {
        return (
            <div>
                <div> <span>tick</span> <span>title</span></div>

                <CompositionItem />
                <CompositionItem />
                <CompositionItem />
                <CompositionItem />
            </div>
        )
    }

}

compositionRow.propTypes = {
    props: propTypes.types,
}
