import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="https://ozelu.com" target="_blank" rel="noopener noreferrer">
          Jenson Bikes
        </a>
        <span className="ms-1">&copy; 2023.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
