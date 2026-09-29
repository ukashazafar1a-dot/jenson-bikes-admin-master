import React, { useEffect, useState } from 'react'
import { CModal,CModalHeader, CModalTitle, CButton, CModalFooter, CModalBody, CFormLabel, CFormInput } from '@coreui/react'

function ImageEditModal({open,setOpen,image,onAltChange}) {
  const [alt,setAlt] = useState('')
  const [isUpdated, setIsUpdated] = useState(false)

  function saveAlt(){
    onAltChange(image._id,alt)
    setOpen(false)
    setAlt('')
  }

  useEffect(()=>{
    if(image?.alt !== alt){
      setIsUpdated(true)
    }else{
      setIsUpdated(false)
    }
  },[alt])

  useEffect(()=>{
      setAlt(image?.alt)
  },[open])
  return (
    <CModal visible={open} onClose={() => setOpen(false)}>
        <CModalHeader onClose={() => setOpen(false)}>
        <CModalTitle>Edit image alt text</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <div className='row'>
                <div className='col-md-5 overflow-hidden'>
                {image && <img className='border w-100' 
                    src={image?.src} 
                    alt={image?.alt}
                />}
                </div>
                <div className='col-md-7'>
                    <CFormLabel htmlFor="pageTitleInput">Image alt text</CFormLabel>
                    <CFormInput type="text" id="pageTitleInput"  value={alt} onChange={(e)=>setAlt(e.currentTarget.value)} placeholder="Alt text"/>
                </div>
            </div>
        </CModalBody>
        <CModalFooter className='justify-content-center'>
        <CButton color="secondary" onClick={() => setOpen(false)}>
            Close
        </CButton>
        <CButton color="danger" onClick={()=>saveAlt()} disabled={!isUpdated}>Save</CButton>
        </CModalFooter>
    </CModal>
  )
}

export default ImageEditModal