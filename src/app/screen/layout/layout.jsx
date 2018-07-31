import React from 'react'
import propTypes from 'prop-types'
import { Cod } from '@containers'

const layout = ({ children }) =>
  <div>
      <div className="content">
        {children}
      </div>
      <Cod />
  </div>

layout.propTypes = {
  children: propTypes.object
}

export default layout
