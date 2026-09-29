import { CButton, CFormInput, CInputGroup, CInputGroupText, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React, { useState,useContext, useEffect } from 'react'
import AddVariantModal from './AddVariantModal'
import { AppContext } from 'src/context/app/appContext'
import Variant from './Variant'
import mernDashApi from 'src/helpers/apiUtils'
import SelectVariantImageModal from './SelectVariantImageModal'
import EditVariantModal from './EditVariantModal'

function Variants({productId}) {
    const {setNotification} = useContext(AppContext)
    const [openAddModal, setOpenAddModal] =  useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openImageModal, setOpenImageModal] = useState(false)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [variants, setVariants] = useState([])
    const [options,setOptions] = useState(null)

  function  handleAddVariant(e){
    e.preventDefault()
    setOpenAddModal(true)
  }
  function handleChangeImage(id){
    console.log("ID of Variant",id)
    let selected = variants.find((v)=>v._id == id)
    setSelectedVariant(selected)
    setOpenImageModal(true)
  }

  function handleEditVariant(id){
    let selected = variants.find((v)=>v._id == id)
    setSelectedVariant(selected)
    setOpenEditModal(true)
  }

  async function onRemoveVariant(id){
    try{
        let formData = new FormData()
        formData.append('product_id',productId)
        formData.append('variant_id',id)

        const {data,status} = await mernDashApi.post('/api/products/variant/delete',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if(status === 200){
            setVariants(data.variants)
            setNotification(false, 'Removed Successfully!')
        }else{
            setNotification(true, 'Something went wrong!')
        }
    }catch(err){
        setNotification(true, err.message)
        console.log("Errr",err)
    }
  }

  async function onAddVariant(values,price,compareAtPrice,sku){
    try{
        let formData = new FormData()
        formData.append('product_id',productId)
        formData.append('price', price)
        formData.append('compare_at_price', compareAtPrice)
        formData.append('sku',sku)

        formData.append('values',JSON.stringify(values))
        
        const {data,status} = await mernDashApi.post('/api/products/variant',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if(status === 200){
            setVariants(data.variants)
            setNotification(false, 'Added Successfully!')
        }else{
            setNotification(true, 'Something went wrong!')
        }
    }catch(err){
        setNotification(true, 'Variant Already Exist!')
        console.log("Errr",err)
    }
  }

  async function onEditVariant(var_id,values,price,compareAtPrice,sku){
    try{
        let formData = new FormData()
        formData.append('product_id',productId)
        formData.append('var_id',var_id)
        formData.append('price', price)
        formData.append('compare_at_price', compareAtPrice)
        formData.append('sku',sku)

        formData.append('values',JSON.stringify(values))
        
        const {data,status} = await mernDashApi.put('/api/products/variant',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if(status === 200){
            setVariants(data.variants)
            setNotification(false, 'Updated Successfully!')
        }else{
            setNotification(true, 'Something went wrong!')
        }
    }catch(err){
        setNotification(true, 'Variant Already Exist!')
        console.log("Errr",err)
    }
  }

  async function onChangeImage(var_id,img_id){
    console.log("Id",var_id,img_id)
    try{
        let formData = new FormData()
        formData.append('product_id',productId)
        formData.append('var_id', var_id)
        formData.append('img_id',img_id)
        
        const {data,status} = await mernDashApi.post('/api/products/variant/image',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if(status === 200){
            setVariants(data.variants)
            setNotification(false, 'Added Successfully!')
        }else{
            setNotification(true, 'Something went wrong!')
        }
    }catch(err){
        setNotification(true, 'Variant Already Exist!')
        console.log("Errr",err)
    }
  }

  async function onRemoveImage(var_id){
    try{
        let formData = new FormData()
        formData.append('product_id',productId)
        formData.append('var_id', var_id)

        const {data,status} = await mernDashApi.post('/api/products/variant/image/delete',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if(status === 200){
            setVariants(data.variants)
            setNotification(false, 'Removed Successfully!')
        }else{
            setNotification(true, 'Something went wrong!')
        }
    }catch(err){
        setNotification(true, err.message)
        console.log("Errr",err)
    }
  }

  useEffect(()=>{
    const getVariants = async ()=>{
        const {data,status} = await mernDashApi.get('/api/products/variant/'+productId)
        const {variants,options} = data
        if(status === 200){
          setVariants(variants)
          setOptions(options)
        }
      }
      getVariants()
  },[])

  if(options?.length < 1) return null

  return (
    <>
    <SelectVariantImageModal open={openImageModal} setOpen={setOpenImageModal} onChange={onChangeImage} onRemove={onRemoveImage} variant={selectedVariant} productId={productId} />
    <AddVariantModal open={openAddModal} setOpen={setOpenAddModal} onAdd={onAddVariant} productId={productId}/>
    <EditVariantModal open={openEditModal} setOpen={setOpenEditModal} variant={selectedVariant} onEdit={onEditVariant} productId={productId} />
        <div style={{padding:'1rem 0', textAlign:'right'}}><CButton color='primary' onClick={(e)=>handleAddVariant(e)}>Add Variant</CButton></div>
        {variants?.length > 0 && <div style={{overflowX: 'auto',overscrollBehaviorX: 'contain'}}>
            <CTable className='border'>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col" className='sticky-cell sticky-cell-first'>#</CTableHeaderCell>
                        <CTableHeaderCell scope="col" className='sticky-cell sticky-cell-second'></CTableHeaderCell>
                        <CTableHeaderCell scope="col">Variant</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Compare At Price</CTableHeaderCell>
                        <CTableHeaderCell scope="col">SKU</CTableHeaderCell>
                        <CTableHeaderCell scope='col' className='sticky-cell sticky-cell-last'>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {variants?.length > 0 && variants.map((v)=>{
                        return <Variant value={v} onRemove={onRemoveVariant} onEdit={handleEditVariant} onChangeImage={handleChangeImage}/>
                    })}
                </CTableBody>
                </CTable>
        </div>}
    </>
  )
}

export default Variants