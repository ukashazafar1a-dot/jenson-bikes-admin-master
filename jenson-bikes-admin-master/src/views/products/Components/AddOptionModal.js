import React, { useEffect, useState } from 'react'
import { CModal,CModalHeader, CModalTitle, CButton, CModalFooter, CModalBody, CFormLabel, CFormInput, CBadge } from '@coreui/react'

function AddOptionModal({open,setOpen,onAdd}) {
  const [name,setName] = useState('')
  const [values,setValues] = useState([])
  const [isUpdated, setIsUpdated] = useState(false)
  const [inputField, setInputField] = useState('')

  function saveOption(){
    onAdd(name,values)
    setOpen(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault()
      // 👇 Get input value
      if(!inputField) return;
      console.log("On enter")
      if(values.includes(inputField)){
        setInputField('')
        return
      }
      setValues([...values, inputField])
      setInputField('')
    }
};

  const removeTag = function(tag){
    let tags = values.filter((item)=>item !== tag)
    setValues(tags)
  }

  useEffect(()=>{
    console.log("Changed")
    if(name != '' && values.length > 0){
      setIsUpdated(true)
    }else{
      setIsUpdated(false)
    }
  },[name,values])

  useEffect(()=>{
    setName('')
    setValues([])
  },[open])

  function renderBadges(items){
    if(items.length === 0) return ''
    return items.map((item,i)=>{
        return <CBadge key={i} className='align-items-center d-inline-flex mb-2' style={{color:'#202223',backgroundColor:'#e4e5e7',marginRight:"10px"}}>
            {item} <CBadge style={{color:'#202223',marginLeft:'7px',cursor:'pointer',padding:'2px',fontSize:'0.9em'}} onClick={()=>removeTag(item)}>X</CBadge>
        </CBadge>
    })
  }

  return (
    <CModal visible={open} onClose={() => setOpen(false)}>
        <CModalHeader onClose={() => setOpen(false)}>
        <CModalTitle>Add Option</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <div className='row'>
                <div className='col-md-12'>
                    <CFormLabel htmlFor="nameInput">Name</CFormLabel>
                    <CFormInput type="text" id="nameInput"  value={name} onChange={(e)=>setName(e.currentTarget.value)} placeholder="Option name e.g: Color"/>
                </div>
                <div className='col-md-12 mt-2'>
                    <CFormLabel htmlFor='valuesInput'>Values</CFormLabel>
                    <CFormInput type='text' id="valuesInput"  onKeyDown={handleKeyDown} value={inputField} onChange={(e)=>setInputField(e.currentTarget.value)} placeholder='option values e.g: blue, red' />
                <div className='mt-2'>
                    {renderBadges(values)}
                </div>
                </div>
            </div>
        </CModalBody>
        <CModalFooter className='justify-content-center'>
        <CButton color="secondary" onClick={() => setOpen(false)}>
            Close
        </CButton>
        <CButton color="danger" onClick={()=>saveOption()} disabled={!isUpdated}>Save</CButton>
        </CModalFooter>
    </CModal>
  )
}

export default AddOptionModal