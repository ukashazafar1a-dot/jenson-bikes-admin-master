import React, { useEffect, useRef, useState,useContext } from 'react'
import { CForm,CCol,CButton,CFormInput,CFormCheck,CInputGroup,CInputGroupText,CFormLabel,CFormSelect } from '@coreui/react'
import { Formik } from 'formik';
import { AppContext } from 'src/context/app/appContext';
import { useNavigate,useParams } from 'react-router-dom';
import { getPackagePreset, upsertPackagePreset } from 'src/helpers/businessRequests';

function Edit() {
    const navigate = useNavigate()
    const {id} = useParams()

  const { setNotification } = useContext(AppContext);
  const [presetId,setPresetId] = useState();
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
          id: presetId,
          name,
          length:length.toString(),
          width:width.toString(),
          height:height.toString(),linearUnit,
          weight:weight.toString(),weightUnit,isActive,isExact
        }
        await upsertPackagePreset(formData)
        setNotification(false,'Updated Successfully!')
        navigate('/package-presets')
    }catch(err){
        setNotification(true, err.message)
        console.log("Errr",err)
    }
    // const res = await axios.post('/api/auth/login', data);
  }

  useEffect(()=>{
    const getPresets = async ()=>{
        try{
            const {data} = await getPackagePreset(id)
            formRef.current.setFieldValue('name',data.name)
            formRef.current.setFieldValue('length',data.length)
            formRef.current.setFieldValue('width',data.width)
            formRef.current.setFieldValue('height',data.height)
            formRef.current.setFieldValue('linearUnit',data.linearUnit)
            formRef.current.setFieldValue('weight',data.weight)
            formRef.current.setFieldValue('weightUnit',data.weightUnit)
            formRef.current.setFieldValue('isActive',data.isActive)
            formRef.current.setFieldValue('isExact',data.isExact)
            setPresetId(data.id)
        } catch (error) {
            setNotification(true,error.message)
        }
    }
    getPresets()
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
                <CButton type="submit" color='info'>Update</CButton>
            </CCol>
        </CForm>
        )}
    </Formik>
    </>
  )
}

export default Edit