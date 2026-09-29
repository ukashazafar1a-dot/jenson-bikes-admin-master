import React, { useState } from 'react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter,CCol,CFormInput,CButton } from '@coreui/react'

function AddModal({visible,setVisible,onAdd}) {
    const [title,setTitle] = useState('')

    function onConfirm(){
        onAdd(title);   
    }
  return (
        <CModal visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>Add new Value!</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className='row'>
                <CCol md={12}>
                    <CFormInput type="text" name='title'
                            id="inputEmail4" label="Title" value={title} 
                            onChange={(e)=>setTitle(e.currentTarget.value)} />
                </CCol>
            </div>
          </CModalBody>
          <CModalFooter className='justify-content-center'>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="success" onClick={(e)=>onConfirm()}>Save</CButton>
          </CModalFooter>
        </CModal>
  )
}

export default AddModal