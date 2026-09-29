import React, { useState } from 'react'
import { CFormLabel, CFormInput,CBadge } from '@coreui/react'

function Tags({value,setValue}) {
  const [inputField, setInputField] = useState('')
  const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
          // 👇 Get input value
          if(!inputField) return;
          console.log("On enter")
          if(value.includes(inputField)){
            setInputField('')
            return
          }
          let tags = value;
          tags.push(inputField);
          setValue('tags', tags)
          setInputField('')
        }
  };

  const removeTag = function(tag){
    let tags = value.filter((item)=>item !== tag)
    setValue('tags', tags)
  }

  function renderBadges(items){
    if(items.length === 0) return ''
    return items.map((item,i)=>{
        return <CBadge key={i} className='align-items-center d-inline-flex mb-2' style={{color:'#202223',backgroundColor:'#e4e5e7',marginRight:"10px"}}>
            {item} <CBadge style={{color:'#202223',marginLeft:'7px',cursor:'pointer',padding:'2px',fontSize:'0.9em'}} onClick={()=>removeTag(item)}>X</CBadge>
        </CBadge>
    })
  }

  return (
    <div className='mt-3'>
        <CFormLabel className='w-100' placeholder='Create a tag'>Tags</CFormLabel>
        <CFormInput type='text' onKeyDown={handleKeyDown} value={inputField}  onChange={(e)=>setInputField(e.currentTarget.value)}/>
        <div className='mt-2'>
            {renderBadges(value)}
        </div>
    </div>
  )
}

export default Tags