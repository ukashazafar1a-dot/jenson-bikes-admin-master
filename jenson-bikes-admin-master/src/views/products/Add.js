import React, { useRef, useState,useContext } from 'react'
import { CForm,CCol,CButton,CFormInput,CFormTextarea,CFormLabel,CCard, CCardBody, CFormSelect, CCardTitle, CSpinner, CInputGroupText, CInputGroup, CFormCheck } from '@coreui/react'
import { Formik } from 'formik';
import mernDashApi from 'src/helpers/apiUtils';
import { AppContext } from 'src/context/app/appContext';
import ImageDropzone from './Components/ImageDropzone'
import { useNavigate } from 'react-router-dom';
import Editor from 'src/components/Editor';
import ImageEditModal from './Components/ImageEditModal';
import slugify from 'react-slugify'
import Tags from './Components/Tags';
import Medias from './Components/Medias';

function Add() {
  const navigate = useNavigate()
  const { setNotification } = useContext(AppContext);
  const [featuredImage, setFeaturedImage] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [pageTitleAltered, setPageTitleAltered] = useState(false)
  const [slugAltered, setSlugAltered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef();
  const initialValues = {
    title: '',
    description: '',
    isActive: '1',
    type: '',
    vendor: '',
    pageTitle: '',
    metaDescription: '',
    slug: '',
    price: 0,
    compare_at_price: 0,
    taxable: false,
    quantity: 0,
    sku: '',
    tags: []
  }

  const saveAlt = function(alt,file){
    let files = featuredImage.map((item)=>{
        if(file === item){
            return Object.assign(item,{
                alt
            });
        }else{
            return item
        }
    })
    setFeaturedImage(files);
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

        const {title,description,isActive,type,vendor,price,compare_at_price,taxable,quantity,sku,tags,pageTitle,metaDescription,slug} = getFormikValues()
        let formData = new FormData()
        formData.append('title',title);
        formData.append('description',description);
        formData.append("isActive", isActive);
        formData.append("type", type);
        formData.append("vendor", vendor);
        formData.append("price", price);
        formData.append("compare_at_price", compare_at_price);
        formData.append("taxable", taxable);
        formData.append("quantity", quantity);
        formData.append("sku", sku);
        formData.append("tags", JSON.stringify(tags));
        formData.append('pageTitle',pageTitle);
        formData.append('metaDescription',metaDescription)
        formData.append('slug',slug)

        mernDashApi.post('/api/products/add',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((data)=>{
            setIsSubmitting(false)
            setNotification(false,'Added Successfully!')
            navigate('/store/products')
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
    {<ImageEditModal open={openEditModal} setOpen={setOpenEditModal} file={featuredImage[0]} onAltChange={saveAlt} />}
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
                            <CCardTitle>Media</CCardTitle>
                            <p className='text-center text-disabled'>Add product first</p>
                        </CCardBody>
                    </CCard>
                    <CCard>
                        <CCardBody>
                            <CCardTitle>Pricing</CCardTitle>
                            <div className='row'>
                                <CCol md={6}>
                                    <CFormLabel className='mt-3'>Price</CFormLabel>
                                    <CInputGroup>
                                        <CInputGroupText>AED</CInputGroupText>
                                        <CFormInput type='number' name='price' value={values.price} onChange={handleChange} />
                                        <CInputGroupText>.00</CInputGroupText>
                                    </CInputGroup>
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel className='mt-3'>Compare at price</CFormLabel>
                                    <CInputGroup>
                                        <CInputGroupText>AED</CInputGroupText>
                                        <CFormInput type='number' name='compare_at_price' value={values.compare_at_price} onChange={handleChange} />
                                        <CInputGroupText>.00</CInputGroupText>
                                    </CInputGroup>
                                </CCol>
                                <CCol md={12} className="mt-3">
                                    <CFormCheck inline id='productTax' name='taxable' value={values.taxable} label={'Charge tax on this product'} onChange={handleChange} />
                                </CCol>
                            </div>
                        </CCardBody>
                    </CCard>
                    <CCard>
                        <CCardBody>
                            <CCardTitle>Inventory</CCardTitle>
                            <div className='row'>
                                <CCol md={6}>
                                    <CFormLabel className='mt-3'>Quantity</CFormLabel>
                                    <CFormInput type='number' name='quantity' value={values.quantity} onChange={handleChange} />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel className='mt-3'>SKU (Stock keeping Unit)</CFormLabel>
                                    <CFormInput type="text" name="sku" value={values.sku} onChange={handleChange} />
                                </CCol>
                            </div>
                        </CCardBody>
                    </CCard>
                    <CCard>
                        <CCardBody>
                            <CCardTitle>Variants</CCardTitle>
                            <p className='text-center text-disabled'>Add product first</p>
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
                                <small style={{display:'block',marginBottom:'1rem'}}>https://ozelu.com/products/{values.slug}</small>
                                <CFormInput type='text'  id='slug' name='slug' onChange={(e)=>changeSlug(e.currentTarget.value)} placeholder={values.slug}></CFormInput>
                            </div>
                        </CCardBody>
                    </CCard>
                </div>
            </CCol>
            <CCol md={4} className="px-4 py-3 rounded-3">
                <CCard>
                    <CCardBody>
                        <CFormLabel>Product Status</CFormLabel>
                        <CFormSelect value={values.isActive} onChange={handleChange} name="isActive" 
                            aria-label="Product Status"
                            options={[
                                { label: 'Active', value: '1' },
                                { label: 'Draft', value: '0' }
                            ]}
                        />
                    </CCardBody>
                </CCard>
                <CCard className='mt-3'>
                    <CCardBody>
                        <CCardTitle>Product organization</CCardTitle>
                        <CFormLabel className='w-100'>Product Type</CFormLabel>
                        <CFormInput type='text' name='type' value={values.type} onChange={handleChange} placeholder='e.g., T-Shirt' />
                        <CFormLabel className='w-100 mt-3'>Vendor</CFormLabel>
                        <CFormInput type='text' name='vendor' value={values.vendor} onChange={handleChange} />
                        <Tags value={values.tags} setValue={setFieldValue}/>
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