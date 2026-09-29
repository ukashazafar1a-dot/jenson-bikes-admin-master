import React, { useEffect, useState } from 'react'
import { CModal,CModalHeader, CModalTitle, CButton, CModalFooter, CModalBody, CFormLabel, CFormInput, CBadge, CFormSelect, CFormCheck } from '@coreui/react'
import mernDashApi from 'src/helpers/apiUtils'
import ContentLoader from 'src/components/Loaders/ContentLoader'

function SelectVariantImageModal({open,setOpen,onChange,variant,productId,onRemove}) {
  const [medias, setMedias] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [isUpdated,setIsUpdated] = useState(false)
  const [isLoading,setIsLoading] = useState(true)


  function saveVariantImage(){
    onChange(variant._id,selectedImage)
    setOpen(false)
  }

  function removeVariantImage(){
    onRemove(variant._id)
    setOpen(false)
  }

  function handleSelectionChange(id){
    setSelectedImage(id)
    setIsUpdated(true)
  }


  useEffect(()=>{
    // setSku('')
    // setPrice(0)
    // setCompareAtPrice(0)
    console.log("Variant is>>",variant)
  },[open])

  useEffect(()=>{
        const getMedias = async ()=>{
            const {data,status} = await mernDashApi.get('/api/products/media/'+productId)
            const {medias} = data
            if(status === 200){
                setMedias(medias)
                setIsLoading(false)
            }
        }
        getMedias()
  },[open])

  function renderMedia(media){
    return (
    <div key={media._id} className='col-md-3 mt-3'>
        <div className='border' style={{width:'100%',height:'100%',display:'flex',position:'relative'}}>
            <div style={{ position: 'absolute',top: '0.15rem',left: '0.25rem'}}>
                <CFormCheck type='radio' name='image' onChange={()=>handleSelectionChange(media._id)} defaultChecked={variant?.featured_image?._id === media._id} />
            </div>
            <div style={{margin:'auto'}}>
                <img src={media.src} width="100%"/>
            </div>
        </div>
    </div>
    )
  }

  return (
    <CModal visible={open} onClose={() => setOpen(false)}>
        <CModalHeader onClose={() => setOpen(false)}>
            <CModalTitle>Select Image</CModalTitle>
        </CModalHeader>
        <CModalBody>
            {isLoading ? <ContentLoader/> : (
            <div className='row'>
                {medias && medias.map((media)=>{
                    return renderMedia(media);
                })}
            </div>
            )}
        </CModalBody>
        <CModalFooter className='justify-content-between'>
            <CButton color='danger' onClick={()=>removeVariantImage()}>Remove</CButton>
            <div>
                <CButton color="secondary" onClick={() => setOpen(false)} style={{marginLeft:'1rem'}}>
                    Close
                </CButton>
                <CButton color="success" onClick={()=>saveVariantImage()} style={{marginLeft:'1rem'}} disabled={!isUpdated}>Save</CButton>
            </div>
        </CModalFooter>
    </CModal>
  )
}

export default SelectVariantImageModal