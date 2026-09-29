import React, { useContext, useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import { CContainer,CRow,CCol,CBadge } from '@coreui/react';
import { getPackageCategory } from 'src/helpers/businessRequests';
import { AppContext } from 'src/context/app/appContext';
   

function View() {
    const {setNotification} = useContext(AppContext)
    const {id} = useParams()
    const [category,setCategory] = useState(null);


    useEffect(()=>{
        const loadCategory =async ()=>{
            try {
                const {data} = await getPackageCategory(id)
                setCategory(data)
            } catch (error) {
                setNotification(true,error.message)
            }
        }
        loadCategory()
    },[id])

  return (
    <CContainer>
        {category && <CRow>
            <CCol>
                <h4>{category?.name}</h4>
                <CBadge color="warning" shape="rounded-pill">{category?.isActive ? 'Active' : 'Draft'}</CBadge>
                <br/>
                <br/>
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope='col'>Key</th>
                            <th scope='col'>Value</th>
                        </tr>
                    </thead>
                    <tbody className='table-group-divider'>
                        <tr>
                            <th scope='row'>Name</th>
                            <td>{category?.name}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Code</th>
                            <td>{category?.code}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Description</th>
                            <td>{category?.description ? category.description : '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </CCol>
        </CRow>}
  </CContainer>
  )
}

export default View