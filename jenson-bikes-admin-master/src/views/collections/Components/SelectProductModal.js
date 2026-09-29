import React, { useEffect, useState,useContext } from 'react'
import { CModal,CModalHeader, CModalTitle, CButton, CModalFooter, CModalBody, CFormCheck } from '@coreui/react'
import ContentLoader from 'src/components/Loaders/ContentLoader'
import mernDashApi from 'src/helpers/apiUtils'
import { AppContext } from 'src/context/app/appContext'

function SelectProductModal({open,setOpen,onSave,items}) {
    const { setNotification } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [selections, setSelections] = useState([])

    function saveSelections(){
        onSave(selections)
        setOpen(false)
    }

    function handleChange(e,id){
        if(e.currentTarget.checked){
            let values = selections;
            values.push(id)
            setSelections(values)
        }else{
            let values = selections.filter((selection)=>selection != id)
            setSelections(values)
        }
        console.log("value",selections)
    }


    function renderItem(product){
        return <div className='row mb-3 pb-2' style={{borderBottom:'1px solid lightgrey'}}>
            <div className='col-1'><CFormCheck defaultChecked={selections.includes(product._id)} onChange={(e)=>handleChange(e,product._id)}/></div>
            <div className='col-3'>
                <div className='border overflow-hidden' style={{width:'50px',height:'50px'}}>
                <img src={product.featured_image} width="100%"/>
                </div>
            </div>
            <div className='col-8'><span>{product.title}</span></div>
        </div>
    }

    useEffect(()=>{
        mernDashApi.get('/api/products/all?limit=infinity').then((data)=>{
        const {products} = data.data;
            setProducts(products);
            console.log("Products>>",products)
            setIsLoading(false)
        }).catch((err)=>{
            setNotification(true,err.message)
        });
    },[])

    useEffect(()=>{
        let values = items.map((item)=>{
            return item._id
        })
        setSelections(values)
    },[items])
    return (
        <CModal visible={open} onClose={() => setOpen(false)}>
            <CModalHeader onClose={() => setOpen(false)}>
            <CModalTitle>Select Products</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {isLoading ? <ContentLoader/> : <>
                    <div className='row' style={{maxHeight:'400px',overflowY:'auto'}}>
                        {products && products.map((product)=>{
                            return renderItem(product)
                        })}
                    </div>
                </>}
            </CModalBody>
            <CModalFooter className='justify-content-center'>
            <CButton color="secondary" onClick={() => setOpen(false)}>
                Close
            </CButton>
            <CButton color="danger" onClick={()=>saveSelections()}>Save</CButton>
            </CModalFooter>
        </CModal>
    )
}

export default SelectProductModal