import React, { useEffect, useRef, useState,useContext } from 'react'
import { CForm,CCol,CButton,CFormInput,CFormCheck,CInputGroup,CInputGroupText,CFormLabel,CFormTextarea } from '@coreui/react'
import { Formik } from 'formik';
import mernDashApi from 'src/helpers/apiUtils';
import { AppContext } from 'src/context/app/appContext';
import { useNavigate,useParams } from 'react-router-dom';
import { packagePurposes } from 'src/assets/data';

function Edit() {
    const navigate = useNavigate()
    const {id} = useParams()

  const { setNotification } = useContext(AppContext);
  const [purposeId,setPurposeId] = useState();
  const formRef = useRef();
  const initialValues = {
    name: '',
    code: 0,
    isActive: false
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
        const {name,code,isActive} = getFormikValues()
        let formData = new FormData()
        formData.append('name',name);
        formData.append('code',code);
        formData.append('isActive',isActive);

        mernDashApi.put('/api/cvtemplates/update',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((data)=>{
            setNotification(false,'Updated Successfully!')
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

  useEffect(()=>{
    const getPurposes = async ()=>{
    //   const { data } = await mernDashApi.get('/api/cvtemplates/template/'+id)
        const purposes = packagePurposes
        let purpose = purposes.find((op)=>op.id == id)
      formRef.current.setFieldValue('name',purpose.name)
      formRef.current.setFieldValue('code',purpose.code)
      formRef.current.setFieldValue('isActive',purpose.isActive)
      setPurposeId(purpose.id)
    }
    getPurposes()
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