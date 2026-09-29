import React, { useRef, useState,useContext } from 'react'
import { CForm,CCol,CButton,CFormInput,CFormTextarea,CFormLabel,CCard, CCardBody, CFormSelect, CCardTitle, CSpinner } from '@coreui/react'
import { Formik } from 'formik';
import mernDashApi from 'src/helpers/apiUtils';
import { AppContext } from 'src/context/app/appContext';
import { useNavigate } from 'react-router-dom';
import Editor from 'src/components/Editor';
import slugify from 'react-slugify'

function Add() {
  const navigate = useNavigate()
  const { setNotification } = useContext(AppContext);
  const [pageTitleAltered, setPageTitleAltered] = useState(false)
  const [slugAltered, setSlugAltered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef();
  const initialValues = {
    title: '',
    description: '',
    isActive: '1',
    pageTitle: '',
    metaDescription: '',
    slug: '',
  }

  const getFormikValues = function(){
    if(formRef?.current) return formRef?.current.values
    return {}
  }

  const validator = function(values){
    const errors = {}
    if(!values.title) errors.title = 'Title is required';
    return errors
  }

  const changeTitle = function(value){
    formRef.current.setFieldValue('title', value);
    if(!pageTitleAltered){
        formRef.current.setFieldValue('pageTitle', value);
    }
    if(!slugAltered){
        formRef.current.setFieldValue('slug', slugify(value))
    }
  }

  const changePageTitle = function(value){
    formRef.current.setFieldValue('pageTitle', value);
    setPageTitleAltered(true)
  }

  const changeSlug = function(value){
    formRef.current.setFieldValue('slug', slugify(value))
    setSlugAltered(true)
  }

  const submitHandler =  async function(){
    try{
        setIsSubmitting(true)
        console.log("Submitting...")
        const {title,description,isActive,pageTitle,metaDescription,slug} = getFormikValues()
        let formData = new FormData()
        formData.append('title',title);
        formData.append('description',description);
        formData.append("isActive", isActive);
        formData.append('pageTitle',pageTitle);
        formData.append('metaDescription',metaDescription)
        formData.append('slug',slug)

        mernDashApi.post('/api/pages/add',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((data)=>{
            setIsSubmitting(false)
            setNotification(false,'Added Successfully!')
            navigate('/store/pages')
        }).catch((err)=>{
            setIsSubmitting(false)
            setNotification(true, err.response.data.message ? err.response.data.message :'Something went wrong!')
        })
    }catch(err){
        setIsSubmitting(false)
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
        <CForm className='row' onSubmit={handleSubmit}>
            <CCol md={8} className="px-4 py-3 rounded-3">
                <div className="row g-3">
                    <CCard>
                        <CCardBody>
                            <CFormInput type="text" name='title' 
                                    id="inputEmail4" label="Title" value={values.title} 
                                    onChange={(e)=>changeTitle(e.currentTarget.value)} feedbackInvalid={errors.title} invalid={errors.title && touched.title} />

                            <CFormLabel className='mt-3'>Description</CFormLabel>
                            <Editor placeholder={"write something..."} value={values.description} setValue={setFieldValue}/>
                        </CCardBody>
                    </CCard>
                    <CCard>
                        <CCardBody>
                            <CCardTitle>Products</CCardTitle>
                        </CCardBody>
                    </CCard>
                    <CCard>
                        <CCardBody>
                            <CCardTitle>Search engine listing</CCardTitle>
                            <div className="mb-3">
                                <CFormLabel htmlFor="pageTitleInput">Page Title</CFormLabel>
                                <CFormInput type="text" id="pageTitleInput" name='pageTitle' value={values.pageTitle} onChange={(e)=>changePageTitle(e.currentTarget.value)} placeholder="Page title"/>
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="metaDescriptionInput">Meta Description</CFormLabel>
                                <CFormTextarea id="metaDescriptionInput" name='metaDescription' value={values.metaDescription} onChange={handleChange} rows={4}></CFormTextarea>
                            </div>
                            <div className='mb-3'>
                                <CFormLabel htmlFor='slug'>Page Slug</CFormLabel>
                                <small style={{display:'block',marginBottom:'1rem'}}>https://ozelu.com/policies/{values.slug}</small>
                                <CFormInput type='text'  id='slug' name='slug' onChange={(e)=>changeSlug(e.currentTarget.value)} placeholder={values.slug}></CFormInput>
                            </div>
                        </CCardBody>
                    </CCard>
                </div>
            </CCol>
            <CCol md={4} className="px-4 py-3 rounded-3">
                <CCard>
                    <CCardBody>
                        <CFormLabel>Collection Status</CFormLabel>
                        <CFormSelect value={values.isActive} onChange={handleChange} name="isActive" 
                            aria-label="Collection Status"
                            options={[
                                { label: 'Active', value: '1' },
                                { label: 'Draft', value: '0' }
                            ]}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
            <hr/>
            <CCol xs={12} className="text-center mb-3">
                <CButton type="submit" color='info' style={{color:'white'}}>
                    {isSubmitting ? (<CSpinner component="span" size="sm" aria-hidden="true"/>) :
                    ('Add') }
                </CButton>
            </CCol>
        </CForm>
        )}
    </Formik>
    </>
  )
}

export default Add