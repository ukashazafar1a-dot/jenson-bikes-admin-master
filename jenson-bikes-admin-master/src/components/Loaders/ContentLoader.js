import { CSpinner } from '@coreui/react'
import React from 'react'

function ContentLoader() {
  return (
    <div className='d-flex justify-content-center py-5 w-100'>
        <CSpinner variant='grow' />
    </div>
  )
}

export default ContentLoader