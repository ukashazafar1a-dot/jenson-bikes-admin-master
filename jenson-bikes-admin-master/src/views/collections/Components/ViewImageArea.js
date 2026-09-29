import React, { useEffect, useState,useContext } from 'react'
import { CCard, CCardBody,CDropdown,CDropdownDivider,CDropdownItem,CDropdownMenu,CDropdownToggle,CFormLabel } from '@coreui/react'
import ImageEditModal from './ImageEditModal';
import mernDashApi from 'src/helpers/apiUtils';
import { AppContext } from 'src/context/app/appContext';
import ContentLoader from 'src/components/Loaders/ContentLoader';
import { useDropzone } from 'react-dropzone';

function ViewImageArea({file,collectionId}) {
    const {setNotification} = useContext(AppContext)
    const [openEditModal, setOpenEditModal] = useState(false);
    const [isChanging, setIsChanging] = useState(false)
    const [image,setImage] = useState(null)
    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            uploadImage(acceptedFiles[0]);
        }
    });

    function uploadImage(file){
        try{
            setIsChanging(true)
            let formData = new FormData()
            formData.append('image',file)
            formData.append('collection_id',collectionId)
    
            mernDashApi.put('/api/medias/collection/upload',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then((data)=>{
                setImage(data.data.image)
                setNotification(false,'Image added!')
                setIsChanging(false)
            }).catch((err)=>{
                setNotification(true,'Something went wrong!')
                setIsChanging(false)
            })
        }catch(err){
            setNotification(true, err.message)
            setIsChanging(false)
            console.log("Errr",err)
        }
    }

    function onAltChange(alt){
        try{
            let formData = new FormData()
            formData.append('alt',alt)
            formData.append('id',image._id)
    
            mernDashApi.put('/api/medias/update',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then((data)=>{
                setImage(data.data.image)
                setNotification(false,'Alt Updated!')
            }).catch((err)=>{
                setNotification(true,'Something went wrong!')
            })
        }catch(err){
            setNotification(true, err.message)
            console.log("Errr",err)
        }
    }

    function changeImage(){
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'

        input.onchange = e => { 
        var file = e.target.files[0];
            if(file){
                setIsChanging(true)
                try{
                    let formData = new FormData()
                    formData.append('image',file)
                    formData.append('image_id',image._id)
                    formData.append('collection_id',collectionId)
            
                    mernDashApi.put('/api/medias/collection/change',formData,{
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    }).then((data)=>{
                        setImage(data.data.image)
                        setNotification(false,'Image changed!')
                        setIsChanging(false)
                    }).catch((err)=>{
                        setNotification(true,'Something went wrong!')
                        setIsChanging(false)
                    })
                }catch(err){
                    setNotification(true, err.message)
                    setIsChanging(false)
                    console.log("Errr",err)
                }
            }
        }

        input.click();
    }

    function deleteImage(){
        try{
            setIsChanging(true)
            let formData = new FormData()
            formData.append('image_id',image._id)
            formData.append('collection_id',collectionId)
    
            mernDashApi.put('/api/medias/collection/delete',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then((data)=>{
                setImage(data.data.image)
                setNotification(false,'Image removed!')
                setIsChanging(false)
            }).catch((err)=>{
                setNotification(true,'Something went wrong!')
                setIsChanging(false)
            })
        }catch(err){
            setNotification(true, err.message)
            setIsChanging(false)
            console.log("Errr",err)
        }
    }

    useEffect(()=>{
        setImage(file);
    },[file])
  return (
    <>
        <ImageEditModal open={openEditModal} setOpen={setOpenEditModal} image={image} onAltChange={onAltChange} />
        <CCard className='mt-3'>
            <CCardBody>
                <CFormLabel className='w-100'>Featured Image
                {image && <CDropdown style={{float: 'right'}}>
                    <CDropdownToggle href="#" className="text-primary bg-body border-0">Edit</CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem href="#" onClick={()=>changeImage()}>Change Image</CDropdownItem>
                        <CDropdownItem href="#" onClick={()=>setOpenEditModal(true)}>Edit Image alt text</CDropdownItem>
                        <CDropdownDivider/>
                        <CDropdownItem href="#" style={{color:'red'}} onClick={()=>deleteImage()}>Delete</CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>}
                </CFormLabel>
                {image ? <div id='featuredImage border' className='mt-3'>
                    {isChanging ? <ContentLoader/> : <img className='w-100' src={image?.src} alt={image?.alt} />}
                </div> : 
                <div {...getRootProps({className: 'custom-dropzone selectForm'})} >
                        <input {...getInputProps()} />
                        {isChanging ? <ContentLoader/> : <div style={{margin: '10px auto',textAlign: 'center',zIndex: '10'}}>
                            <h2>Drop or browse files here</h2>
                        </div>}
                </div>}
            </CCardBody>
        </CCard>
    </>
  )
}

export default ViewImageArea