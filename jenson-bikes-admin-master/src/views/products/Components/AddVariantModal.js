import React, { useEffect, useState } from 'react'
import { CModal,CModalHeader, CModalTitle, CButton, CModalFooter, CModalBody, CFormLabel, CFormInput, CBadge, CFormSelect } from '@coreui/react'
import mernDashApi from 'src/helpers/apiUtils'

function AddVariantModal({open,setOpen,onAdd,productId}) {
  const [options, setOptions] = useState([])
  const [values,setValues] = useState([])
  const [price,setPrice] = useState(0)
  const [compareAtPrice, setCompareAtPrice] = useState(0)
  const [sku, setSku] = useState('')

  function saveVariant(){
    onAdd(values,price,compareAtPrice,sku)
    setOpen(false)
  }

  function changeOptionValue(e,i){
    e.preventDefault()
    let newValues = values;
    newValues[i] = e.currentTarget.value
    setValues([...newValues])
  }

  useEffect(()=>{
    setSku('')
    setPrice(0)
    setCompareAtPrice(0)
  },[open])

  useEffect(()=>{
    const getOptions = async ()=>{
        const {data,status} = await mernDashApi.get('/api/products/option/'+productId)
        const {options} = data
        if(status === 200){
          setOptions(options)
          let newValues = []
          options.forEach((option)=>{
            newValues.push(option.values[0]);
          })
          setValues(newValues)
        }
      }
      getOptions()
  },[])

  return (
    <CModal visible={open} onClose={() => setOpen(false)}>
        <CModalHeader onClose={() => setOpen(false)}>
            <CModalTitle>Add Variant</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <div className='row'>
                {options.length > 0 && values && options.map((option,i)=>{
                    return <div className='col-md-4' key={i}>
                        <CFormLabel htmlFor='option'>{option.name}</CFormLabel>
                        <CFormSelect size="lg" id='option' onChange={(e)=>changeOptionValue(e,i)}  value={values[i]} aria-label="Option Selection">
                            {option && option.values.map((value)=>{
                                return <option value={value}>{value}</option>
                            })}
                        </CFormSelect>
                    </div>
                })}
                <div className='col-md-12 mt-3'>
                    <CFormLabel htmlFor="priceInput">Price</CFormLabel>
                    <CFormInput type="text" id="priceInput"  value={price} onChange={(e)=>setPrice(e.currentTarget.value)} min={0}/>
                </div>
                <div className='col-md-12 mt-3'>
                    <CFormLabel htmlFor="compareAtPriceInput">Compare At Price</CFormLabel>
                    <CFormInput type="text" id="compareAtPriceInput"  value={compareAtPrice} onChange={(e)=>setCompareAtPrice(e.currentTarget.value)} min={0}/>
                </div>
                <div className='col-md-12 mt-3'>
                    <CFormLabel htmlFor="skuInput">SKU</CFormLabel>
                    <CFormInput type="text" id="skuInput"  value={sku} onChange={(e)=>setSku(e.currentTarget.value)} />
                </div>
            </div>
        </CModalBody>
        <CModalFooter className='justify-content-center'>
        <CButton color="secondary" onClick={() => setOpen(false)}>
            Close
        </CButton>
        <CButton color="danger" onClick={()=>saveVariant()}>Save</CButton>
        </CModalFooter>
    </CModal>
  )
}

export default AddVariantModal