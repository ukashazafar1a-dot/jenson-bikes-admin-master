import React, { useEffect, useState } from 'react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter,CCol,CFormInput,CButton } from '@coreui/react'

function EditModal({area,visible,setVisible,onEdit}) {
    const [title,setTitle] = useState('')

    function onConfirm(){
        onEdit(title,area._id)
    }

    useEffect(()=>{
        setTitle(area?.title)
    },[area])
  return (
        <CModal visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>Edit value!</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className='row'>
                <CCol md={12}>
                    <CFormInput type="text" name='title'
                            id="inputEmail4" label="AreaSet" value={title} 
                            onChange={(e)=>setTitle(e.currentTarget.value)} />
                </CCol>
            </div>
          </CModalBody>
          <CModalFooter className='justify-content-center'>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="success" onClick={(e)=>onConfirm()}>Update</CButton>
          </CModalFooter>
        </CModal>
  )
}

export default EditModal