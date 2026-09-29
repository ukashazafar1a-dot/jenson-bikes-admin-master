import React, { useEffect, useRef, useState,useContext } from 'react'
import { CForm,CCol,CButton,CFormInput,CFormTextarea,CFormCheck,CInputGroup,CInputGroupText,CFormLabel } from '@coreui/react'
import { Formik } from 'formik';
import mernDashApi from 'src/helpers/apiUtils';
import { AppContext } from 'src/context/app/appContext';
import { useNavigate } from 'react-router-dom';
import { upsertPackageCategory } from 'src/helpers/businessRequests';

function Add() {
    const navigate = useNavigate()
  const { setNotification } = useContext(AppContext);
  const formRef = useRef();
  const initialValues = {
    name: '',
    code: 0,
    isActive: false,
    description: ''
  }


  const getFormikValues = function(){
    if(formRef?.current) return formRef?.current.values
    return {}
  }

  const validator = function(values){
    const errors = {}
    if(!values.name) errors.name = 'Name is required';
    return errors
  }

  const submitHandler =  async function(){
    try{
        const {name,code,isActive,description} = getFormikValues()
        let formData = {
          id: 0,
          sortOrder: 0,
          name,code,isActive,description
        }
        await upsertPackageCategory(formData)
        setNotification(false,'Added Successfully!')
        navigate('/package-categories')
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
            <CCol xs={12}>
                <CFormCheck type="checkbox" id="gridCheck" label="Is Active" name='isActive' 
                checked={values.isActive} onChange={(e)=>setFieldValue('isActive', !values.isActive)}/>
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" name='name' 
                        id="inputEmail4" label="name" value={values.name} 
                        onChange={handleChange} feedbackInvalid={errors.name} invalid={errors.name && touched.name} />
            </CCol>
            <CCol md={6}>
                <CFormLabel htmlFor="autoSizingInputGroup">Code</CFormLabel>
                <CInputGroup>
                    <CFormInput id="autoSizingInputGroup" type='number' name='code' value={values.code}
                     onChange={handleChange}
                     placeholder="Code"/>
                </CInputGroup>
            </CCol>
            <CCol md={12}>
                <CFormTextarea name='description' label="description" value={values.description} onChange={handleChange} feedbackInvalid={errors.description} invalid={errors.description && touched.description} />
            </CCol>
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