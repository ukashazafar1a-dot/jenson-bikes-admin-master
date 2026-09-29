import React, { useEffect, useRef, useState,useContext } from 'react'
import { CForm,CCol,CButton,CFormInput,CFormCheck,CInputGroup,CInputGroupText,CFormLabel,CFormTextarea } from '@coreui/react'
import { Formik } from 'formik';
import { AppContext } from 'src/context/app/appContext';
import { useNavigate,useParams } from 'react-router-dom';
import { getInsuranceOption, upsertInsuranceOptions } from 'src/helpers/businessRequests';

function Edit() {
    const navigate = useNavigate()
    const {id} = useParams()

  const { setNotification } = useContext(AppContext);
  const [optionId,setOptionId] = useState();
  const formRef = useRef();
  const initialValues = {
    name: '',
    coverage: 0,
    cost: 0,
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
        const {name,coverage,cost,isActive,description} = getFormikValues()
        let formData = {
          id: optionId,
          name,coverage,cost,isActive,description
        }
        await upsertInsuranceOptions(formData)
        setNotification(false,'Updated Successfully!')
        navigate('/insurance-options')
    }catch(err){
        setNotification(true, err.message)
        console.log("Errr",err)
    }
    // const res = await axios.post('/api/auth/login', data);
  }

  useEffect(()=>{
    const getOptions = async ()=>{
      try {
        const {data} = await getInsuranceOption(id)
        formRef.current.setFieldValue('name',data.name)
        formRef.current.setFieldValue('coverage',data.coverage)
        formRef.current.setFieldValue('cost',data.cost)
        formRef.current.setFieldValue('isActive',data.isActive)
        formRef.current.setFieldValue('description',data.description)
        setOptionId(data.id)
      } catch (error) {
        setNotification(true,error.message)
      }
    }
    getOptions()
  },[])

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
            <CCol md={12}>
                <CFormInput type="text" name='name' 
                        id="inputEmail4" label="name" value={values.name} 
                        onChange={handleChange} feedbackInvalid={errors.name} invalid={errors.name && touched.name} />
            </CCol>
            <CCol md={6}>
                <CFormLabel htmlFor="autoSizingInputGroup">Coverage</CFormLabel>
                <CInputGroup>
                    <CFormInput id="autoSizingInputGroup" type='number' name='coverage' value={values.coverage}
                     onChange={handleChange}
                     placeholder="Coverage"/>
                    <CInputGroupText>USD</CInputGroupText>
                </CInputGroup>
            </CCol>
            <CCol md={6}>
                <CFormLabel htmlFor="autoSizingInputGroup">Cost</CFormLabel>
                <CInputGroup>
                    <CFormInput id="autoSizingInputGroup" type='number' name='cost' value={values.cost}
                     onChange={handleChange}
                     placeholder="Cost"/>
                    <CInputGroupText>USD</CInputGroupText>
                </CInputGroup>
            </CCol>
            <CCol md={12}>
                <CFormTextarea name='description' label="description" value={values.description} onChange={handleChange} feedbackInvalid={errors.description} invalid={errors.description && touched.description} />
            </CCol>
            <CCol xs={12} className="text-center">
                <CButton type="submit" color='info'>Update</CButton>
            </CCol>
        </CForm>
        )}
    </Formik>
    </>
  )
}

export default Edit