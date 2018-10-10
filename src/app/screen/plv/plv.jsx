import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { contentPath } from '@util/helper'
class plv extends React.Component {
    constructor(props) {
        super()
        this.state = {
            images: props.images,
            image: '',
            indexer: 0,
        }
    }

    componentWillMount() {
        this.handleImage.call(this)
    }

    handleImage() {
        this.setImage.call(this)

        setTimeout(() => {
            this.handleIndexer.call(this)
        }, `${this.state.images[this.state.indexer]['Durée de la Rotation']}000`)
    }

    setImage() {
        this.setState({
            image: this.state.images[this.state.indexer]['Contenu Image']
        })
    }

    handleIndexer() {
        let indexer = this.state.indexer + 1 >= this.state.images.length ? 0 : this.state.indexer + 1
        this.setState({
            indexer
        })

        // console.info('len', this.state.indexer)

        this.handleImage.call(this)
    }

    componentDidMount() {
        console.log('this.props :', Object.assign({}, this.props))
    }

    componentWillReceiveProps(nextProps){
        console.info('nextProps', nextProps)
    }

    render() {
        return (
            <div className='screen1__container'>
                <img src={contentPath + this.state.image} />
            </div>
        )
    }
}

plv.propTypes = {
    props: propTypes.object,
}

export default connect(store => {
    console.info('store plv', store)
    console.info('contentPath', contentPath)
    return {
        images: store.datasource.datasources['COD.PLV.matin']
    }
})(plv)
