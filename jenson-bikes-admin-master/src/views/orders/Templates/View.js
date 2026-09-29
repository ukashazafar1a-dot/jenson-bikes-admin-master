import React, { useEffect,useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CContainer,CRow,CCol,CBadge, CButton } from '@coreui/react';
import mernDashApi from 'src/helpers/apiUtils';   

function View() {
    const {id} = useParams()
    const [order,setOrder] = useState(null);

    useEffect(()=>{
        const loadorder =async ()=>{
            const {data} = await mernDashApi.get('/api/orders/templateOrders/'+id)
            console.log("Order", data.order)
            setOrder(data.order)
        }
        loadorder()
    },[])

  return (
    <>
    {order && <CContainer>
            <CRow>
                {/* <CCol className='text-center'>
                    <img src={"/public/cvtemplates/"+template?.preview} className="w-50 rounded-4" />
                </CCol> */}
                <CCol>
                    <h4>{'# ' + order?._id}</h4>
                    <small>{order?.price} AED</small><CBadge color={order?.status === "CAPTURED" ? "success" : "danger"} shape="rounded-pill" style={{marginLeft:'2rem'}}>{order?.status}</CBadge>

                    <div className='my-4'>
                      <p><strong>Template: </strong> <Link to={'/cv-templates/view/'+order?.template?._id}><small>{order?.template?.title}</small></Link></p>
                    </div>

                    <div className='my-4'>
                        <p><strong>Token:</strong>{' '} <small>{order?.token}</small></p>
                        <p><strong>Charge ID:</strong> {' '} <small>{order?.chg_id}</small></p>
                    </div>

                    <table style={{fontFamily: 'arial, sans-serif', borderCollapse: 'collapse', width: '100%', marginTop: '2rem'}}>
                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}} >First Name</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}} >{order?.firstname}</td>
                        </tr>

                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>Last Name</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}}>{order?.lastname}</td>
                        </tr>

                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>Phone</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}}>{order?.phone}</td>
                        </tr>
                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>Email</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}}>{order?.email}</td>
                        </tr>
                    </table>
                </CCol>
            </CRow>
    </CContainer>}
  </>
  )
}

export default View