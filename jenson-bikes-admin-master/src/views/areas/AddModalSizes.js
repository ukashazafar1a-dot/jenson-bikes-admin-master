import React, { useState } from 'react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter,CCol,CFormInput,CButton } from '@coreui/react'

function AddModal({visible,setVisible,onAdd}) {
    const [areaSet,setAreaSet] = useState(1)
    const [price,setPrice] = useState(5)

    function onConfirm(){
        onAdd(areaSet,price);   
    }
  return (
        <CModal visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>Add new Value!</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className='row'>
                <CCol md={6}>
                    <CFormInput type="number" name='areaset' min={1} 
                            id="inputEmail4" label="AreaSet" value={areaSet} 
                            onChange={(e)=>setAreaSet(e.currentTarget.value)} />
                </CCol>
                <CCol md={6}>
                    <CFormInput type="number" name='price' min={0}
                            id="inputEmail4" label="Price" value={price} 
                            onChange={(e)=>setPrice(e.currentTarget.value)} />
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