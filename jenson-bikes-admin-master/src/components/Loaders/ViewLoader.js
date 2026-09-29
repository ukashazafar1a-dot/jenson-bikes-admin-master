import React from 'react'
import { CSpinner } from '@coreui/react'

function ViewLoader() {
  return (
    <div className='d-flex justify-content-center py-5 w-100'>
        <CSpinner variant='grow' />
    </div>
  )
}

export default ViewLoader