import React, { useEffect, useState } from 'react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter,CCol,CFormInput,CButton } from '@coreui/react'

function EditModal({area,visible,setVisible,onEdit}) {
    const [name,setName] = useState('')
    const [areaSet,setAreaSet] = useState(1)

    function onConfirm(){
        onEdit(name,areaSet,area._id)
    }

    useEffect(()=>{
        setName(area?.name)
        setAreaSet(area?.areaset)
    },[area])
  return (
        <CModal visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>Edit area!</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className='row'>
                <CCol md={6}>
                    <CFormInput type="text" name='name' 
                            id="inputEmail4" label="Name" value={name} 
                            onChange={(e)=>setName(e.currentTarget.value)} />
                </CCol>
                <CCol md={6}>
                    <CFormInput type="number" name='areaset' min={1} 
                            id="inputEmail4" label="AreaSet" value={areaSet} 
                            onChange={(e)=>setAreaSet(e.currentTarget.value)} />
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