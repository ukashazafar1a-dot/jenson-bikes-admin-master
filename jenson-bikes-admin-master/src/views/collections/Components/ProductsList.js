import { CButton } from '@coreui/react'
import React, { useState, useContext, useEffect } from 'react'
import SelectProductModal from './SelectProductModal'
import { AppContext } from 'src/context/app/appContext'
import mernDashApi from 'src/helpers/apiUtils'
import { Link } from 'react-router-dom'

function ProductsList({collectionId}) {
    const { setNotification } = useContext(AppContext);
    const [openSelectProductModal, setOpenSelectProductModal] = useState(false)
    const [products, setProducts] = useState([])

    function handleOpenModal(e){
        e.preventDefault()
        setOpenSelectProductModal(true)
    }

    async function onSaveSelections(selections){
        try{
            let formData = new FormData()
            formData.append('selections',JSON.stringify(selections));

            const {data,status} = await mernDashApi.post('/api/collections/'+ collectionId +'/products',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            const {products} = data
            if(status === 200){
                setProducts(products)
                setNotification(false,'Added Successfully!')
            }else{
                setNotification(true, 'Something went wrong!')
            }
        }catch(err){
            setNotification(true, err.message)
            console.log("Errr",err)
        }
    }

    useEffect(()=>{
        const getProducts = async ()=>{
            const {data,status} = await mernDashApi.get('/api/collections/'+collectionId+'/products')
            const {products} = data
            if(status === 200){
                setProducts(products)
            }
        }
        getProducts()
    },[])

    function renderItem(product){
        return <div className='row mb-3 pb-2' style={{borderBottom:'1px solid lightgrey'}}>
            <div className='col-3'>
                <div className='border overflow-hidden' style={{width:'50px',height:'50px'}}>
                <img src={product.featured_image} width="100%"/>
                </div>
            </div>
            <div className='col-8'>
                <Link to={'/store/products/view/'+product._id}><span>{product.title}</span></Link>
            </div>
        </div>
    }


  return (
    <>
        <SelectProductModal open={openSelectProductModal} setOpen={setOpenSelectProductModal} items={products} onSave={onSaveSelections}/>
        <div className='d-flex justify-content-end'>
            <CButton color='primary' onClick={handleOpenModal}>Add Products</CButton>
        </div>
        <div>
            {products.length < 1 ? 'No products' : <div>
                {products.map((product)=>{
                    return renderItem(product)
                })}
                </div>}
        </div>
    </>
  )
}

export default ProductsList