import React, { useEffect, useRef, useState,useContext } from 'react'
import { CForm,CCol,CButton,CFormInput,CFormCheck,CInputGroup,CInputGroupText,CFormLabel } from '@coreui/react'
import { Formik } from 'formik';
import mernDashApi from 'src/helpers/apiUtils';
import { AppContext } from 'src/context/app/appContext';
import ImageDropzone from '../../components/ImageDropzone'
import { useNavigate } from 'react-router-dom';

function Add() {
    const navigate = useNavigate()
  const { setNotification } = useContext(AppContext);
  const [preview,setPreview] = useState([]);
  const formRef = useRef();
  const initialValues = {
    title: '',
    isPaid: false,
    price: 0,
    file: null
  }

  const getFormikValues = function(){
    if(formRef?.current) return formRef?.current.values
    return {}
  }

  const validator = function(values){
    const errors = {}
    console.log("Values",values)
    if(!values.title) errors.title = 'Title is required';
    if(!values.file) errors.file = 'File is required';
    return errors
  }

  const submitHandler =  async function(){
    try{
        const {title,isPaid,file,price} = getFormikValues()
        let formData = new FormData()
        formData.append('title',title);
        formData.append('isPaid',isPaid);
        formData.append("cv", file);
        formData.append('preview',preview)

        preview.forEach((file) => {
            formData.append("preview", file);
        });

        if(!isPaid){
            formData.append('price',0)
        }else{
            formData.append('price',price)
        }
        console.log("URL",'/api/cvtemplates/add')
        mernDashApi.post('/api/cvtemplates/add',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((data)=>{
            setNotification(false,'Added Successfully!')
            navigate('/cv-templates')
        }).catch((err)=>{
            setNotification(true,'Something went wrong!')
        })
    }catch(err){
        setNotification(true, err.message)
        console.log("Errr",err)
    }
    // const res = await axios.post('/api/auth/login', data);
  }

  return (
    <>
    <Formik 
        innerRef={formRef}
        initialValues={initialValues}
        validate={validator}
        onSubmit={()=>{
            submitHandler()
        }}>
            {({values,errors,touched,isValid,handleSubmit,handleChange,setFieldValue})=>(
        <CForm className="row g-3" onSubmit={handleSubmit}>
            <CCol md={6}>
                <CFormInput type="text" name='title' 
                        id="inputEmail4" label="Title" value={values.title} 
                        onChange={handleChange} feedbackInvalid={errors.title} invalid={errors.title && touched.title} />
            </CCol>
            <CCol md={6}>
                <CFormInput type='file' label="Document" accept='.doc,.docx' 
                    onChange={(e)=>setFieldValue('file',e.currentTarget.files[0])}
                    feedbackInvalid={errors.file} invalid={errors.file && touched.file}/>
            </CCol>
            <CCol xs={12}>
                <CFormLabel htmlFor='preview'>Preview</CFormLabel>
                <div id='preview'>
                    <ImageDropzone files={preview} setFiles={setPreview}/>
                </div>
            </CCol>
            <CCol xs={12}>
                <CFormCheck type="checkbox" id="gridCheck" label="Is Paid" name='file' 
                checked={values.isPaid} onChange={(e)=>setFieldValue('isPaid', !values.isPaid)}/>
            </CCol>
            {values.isPaid && <CCol md={12}>
                <CFormLabel htmlFor="autoSizingInputGroup">Price</CFormLabel>
                <CInputGroup>
                    <CFormInput id="autoSizingInputGroup" type='number' name='price' value={values.price}
                     onChange={handleChange}
                     placeholder="Price"/>
                    <CInputGroupText>AED</CInputGroupText>
                </CInputGroup>
            </CCol>}
            <CCol xs={12} className="text-center">
                <CButton type="submit" color='info'>Add</CButton>
            </CCol>
        </CForm>
        )}
    </Formik>
    </>
  )
}

export default Add