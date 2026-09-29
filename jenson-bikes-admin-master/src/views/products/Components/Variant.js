import { CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react'
import React, { useEffect } from 'react'



function Variant({value,onRemove,onEdit,onChangeImage}) {

    function handleChangeImage(e){
        e.preventDefault()
        onChangeImage(value._id)
    }

    function handleEditVariant(e,id){
        e.preventDefault()
        onEdit(id)
    }

    function handleRemoveVariant(e,id){
        e.preventDefault()
        onRemove(id)
    }

    function renderImage(){
        if(value?.featured_image){
            return(
                <div class="Polaris-DropZone_1ehhx Polaris-DropZone--sizeSmall_7647q" onClick={handleChangeImage} aria-disabled="false">
                    <div class="Polaris-DropZone__Container_13mbo">
                        <div class="ANbx6">
                            <span class="Polaris-Thumbnail_15hj1 Polaris-Thumbnail--sizeMedium_5f35p">
                                <img alt="" src={value.featured_image.src} />
                            </span>
                        </div>
                    </div>
                </div>
            )
        }else{
            return (<div class="Polaris-DropZone_1ehhx Polaris-DropZone--sizeSmall_7647q" onClick={handleChangeImage} aria-disabled="false">
                <div class="Polaris-DropZone__Container_13mbo">
                    <div class="ANbx6">
                        <div class="mLUtp">
                            <span class="Polaris-Icon_yj27d Polaris-Icon--colorSubdued_113xs Polaris-Icon--applyColor_2y25n">
                                <span class="Polaris-Text--root_yj4ah Polaris-Text--bodySm_nvqxj Polaris-Text--regular_pjgr0 Polaris-Text--visuallyHidden_yrtt6"></span>
                                <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg_375hu" focusable="false" aria-hidden="true"><path d="M19 2.5a1.5 1.5 0 0 0-1.5-1.5h-15a1.5 1.5 0 0 0-1.5 1.5v15a1.5 1.5 0 0 0 1.5 1.5h7.5v-2h-6.503c-.41 0-.64-.46-.4-.79l3.553-4.051c.19-.21.52-.21.72-.01l1.63 1.851 3.06-4.781a.5.5 0 0 1 .84.02l.72 1.251a5.98 5.98 0 0 1 2.38-.49h3v-7.5zm-11.5 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm12.207 10.793a1 1 0 0 0-.707-.293h-2v-2a1 1 0 0 0-2 0v2h-2a1 1 0 0 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 0 0 .707-1.707z"></path></svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>)
        }
    }

    useEffect(()=>{
        console.log("Variant",value)
    },[])

  return (
      <>
      <CTableRow>
        <CTableHeaderCell scope="row" className='sticky-cell sticky-cell-first' >1</CTableHeaderCell>
        <CTableDataCell className='sticky-cell sticky-cell-second'>
            {renderImage()}
        </CTableDataCell>
        <CTableDataCell style={{minWidth:'140px'}}>{value.title}</CTableDataCell>
        <CTableDataCell style={{minWidth:'120px'}}>
            <span style={{color: '#6d7175'}}>AED </span>{value.price}
        </CTableDataCell>
        <CTableDataCell style={{minWidth:'160px'}}>
            <span style={{color: '#6d7175'}}>AED </span>{value.compare_at_price}
        </CTableDataCell>
        <CTableDataCell>
            {value.sku}
        </CTableDataCell>
        <CTableDataCell className='sticky-cell sticky-cell-last'>
        <a href="#" onClick={(e)=>handleEditVariant(e,value._id)}>Edit</a>{' '}<a href="#" onClick={(e)=>handleRemoveVariant(e,value._id)}>Del</a>
        </CTableDataCell>
    </CTableRow>
    </>
  )
}

export default Variant