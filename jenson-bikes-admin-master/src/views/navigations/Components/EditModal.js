import React, { useEffect, useState } from 'react'
import { CModal,CModalHeader, CModalTitle, CButton, CModalFooter, CModalBody, CFormLabel, CFormInput } from '@coreui/react'

function AddModal({open,setOpen,data,onEdit}) {
  const [title,setTitle] = useState('')
  const [url,setUrl] = useState('')

  function editItem(){
    onEdit(title,url)
  }

  useEffect(()=>{
    setTitle(data.title)
    setUrl(data.url)
  },[open])

  return (
    <CModal visible={open} onClose={() => setOpen(false)}>
        <CModalHeader onClose={() => setOpen(false)}>
        <CModalTitle>Edit Menu Item</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <div className='row'>
                <div className='col-md-12'>
                    <CFormLabel htmlFor="pageTitleInput">Title</CFormLabel>
                    <CFormInput type="text" id="pageTitleInput"  value={title} onChange={(e)=>setTitle(e.currentTarget.value)} placeholder="Title"/>
                </div>
                <div className='col-md-12'>
                    <CFormLabel htmlFor="pageTitleInput">Url</CFormLabel>
                    <CFormInput type="text" id="pageTitleInput"  value={url} onChange={(e)=>setUrl(e.currentTarget.value)} placeholder="Url"/>
                </div>
            </div>
        </CModalBody>
        <CModalFooter className='justify-content-center'>
        <CButton color="secondary" onClick={() => setOpen(false)}>
            Close
        </CButton>
        <CButton color="danger" onClick={()=>editItem()}>Update</CButton>
        </CModalFooter>
    </CModal>
  )
}

export default AddModal