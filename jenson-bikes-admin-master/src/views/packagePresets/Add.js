import React, { useEffect, useRef, useState,useContext } from 'react'
import { CForm,CCol,CButton,CFormInput,CFormTextarea,CFormCheck,CInputGroup,CInputGroupText,CFormLabel, CFormSelect } from '@coreui/react'
import { Formik } from 'formik';
import { AppContext } from 'src/context/app/appContext';
import { useNavigate } from 'react-router-dom';
import { upsertPackagePreset } from 'src/helpers/businessRequests';


function Add() {
    const navigate = useNavigate()
  const { setNotification } = useContext(AppContext);
  const formRef = useRef();
  const initialValues = {
    name: '',
    length: 0,
    width: 0,
    height: 0,
    linearUnit: 'in',
    weight: 0,
    weightUnit: 'lb',
    isActive: false,
    isExact: false
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
        const {name,length,width,height,linearUnit,weight,weightUnit,isActive,isExact} = getFormikValues()
        let formData = {
            id: 0,
            name,
            length:length.toString(),
            width:width.toString(),
            height:height.toString(),linearUnit,
            weight:weight.toString(),weightUnit,isActive,isExact
        }

        await upsertPackagePreset(formData)
        setNotification(false,'Added Successfully!')
        navigate('/package-presets')
    }catch(err){
        setNotification(true, err.message)
        console.log("Errr",err)
    }
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
            <CCol xs={6}>
                <CFormCheck type="checkbox" id="gridCheck" label="Is Active" name='isActive' 
                checked={values.isActive} onChange={(e)=>setFieldValue('isActive', !values.isActive)}/>
            </CCol>
            <CCol xs={6}>
                <CFormCheck type="checkbox" id="gridCheck" label="Is Exact" name='isExact' 
                checked={values.isExact} onChange={(e)=>setFieldValue('isExact', !values.isExact)}/>
            </CCol>
            <CCol md={12}>
                <CFormInput type="text" name='name' 
                        id="inputEmail4" label="Name" value={values.name} 
                        onChange={handleChange} feedbackInvalid={errors.name} invalid={errors.name && touched.name} />
            </CCol>
            <CCol md={3}>
                <CFormLabel htmlFor="autoSizingInputGroup">Length</CFormLabel>
                <CInputGroup>
                    <CFormInput id="autoSizingInputGroup" type='number' name='length' value={values.length}
                     onChange={handleChange}
                     placeholder="Length"/>
                    <CInputGroupText>{values.linearUnit}</CInputGroupText>
                </CInputGroup>
            </CCol>
            <CCol md={3}>
                <CFormLabel htmlFor="autoSizingInputGroup">Width</CFormLabel>
                <CInputGroup>
                    <CFormInput id="autoSizingInputGroup" type='number' name='width' value={values.width}
                     onChange={handleChange}
                     placeholder="Width"/>
                    <CInputGroupText>{values.linearUnit}</CInputGroupText>
                </CInputGroup>
            </CCol>
            <CCol md={3}>
                <CFormLabel htmlFor="autoSizingInputGroup">Height</CFormLabel>
                <CInputGroup>
                    <CFormInput id="autoSizingInputGroup" type='number' name='height' value={values.height}
                     onChange={handleChange}
                     placeholder="Height"/>
                    <CInputGroupText>{values.linearUnit}</CInputGroupText>
                </CInputGroup>
            </CCol>
            <CCol md={3}>
  `          <CFormSelect value={values.linearUnit} onChange={handleChange} name='linearUnit'
                aria-label="Linear Unit" label="Linear Unit"
                options={[
                    { label: 'IN', value: 'in' },
                    { label: 'CM', value: 'cm' },
                ]}
                />`
            </CCol>
            <CCol md={6}>
                <CFormLabel htmlFor="autoSizingInputGroup">Weight</CFormLabel>
                <CInputGroup>
                    <CFormInput id="autoSizingInputGroup" type='number' name='weight' value={values.weight}
                     onChange={handleChange}
                     placeholder="Weight"/>
                    <CInputGroupText>{values.weightUnit}</CInputGroupText>
                </CInputGroup>
            </CCol>
            <CCol md={6}>
  `          <CFormSelect value={values.weightUnit} onChange={handleChange} name='weightUnit'
                aria-label="Weight Unit" label="Weight Unit"
                options={[
                    { label: 'LB', value: 'lb' },
                    { label: 'KG', value: 'kg' },
                ]}
                />`
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