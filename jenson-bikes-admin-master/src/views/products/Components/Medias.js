import React, { useState, useEffect, useContext } from 'react'
import ContentLoader from 'src/components/Loaders/ContentLoader';
import { AppContext } from 'src/context/app/appContext';
import mernDashApi from 'src/helpers/apiUtils';
import Preview from './Preview';

function Medias({productId}) {
    const [isLoading, setIsLoading] = useState(true)
    const { setNotification } = useContext(AppContext);
    const [medias, setMedias] = useState([])

    const uploadMedia =async (files) => {
        try{
            let formData = new FormData()
            formData.append('product_id',productId)
            files.forEach((file)=>{
                formData.append('files',file)
            })
            const {data,status} = await mernDashApi.post('/api/products/media/upload',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            if(status === 200){
                setMedias(data.medias)
                setNotification(false, 'Added Successfully!')
            }else{
                setNotification(true, 'Something went wrong!')
            }
        }catch(err){
            setNotification(true, err.message)
            console.log("Errr",err)
        }
    };

    const updateOrder = async (files)=>{
        try{
            let medias = files.map((file)=>{
                return {
                    id: file._id,
                    position: file.position
                }
            })

            let formData = new FormData()
            formData.append('product_id',productId)
            formData.append('medias',JSON.stringify(medias))

            const {data,status} = await mernDashApi.post('/api/products/media/ordered',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            if(status === 200){
                setMedias(data.medias)
                setNotification(false, 'Order changed!')
            }else{
                setNotification(true, 'Something went wrong!')
            }
        }catch(err){
            setNotification(true, err.message)
            console.log("Errr",err)
        }
    }
    
    const deleteImage =async (id) => {
        try{
            let formData = new FormData()
            formData.append('product_id',productId)
            formData.append('image_id',id)

            const {data,status} = await mernDashApi.post('/api/products/media/remove',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            if(status === 200){
                setMedias(data.medias)
                setNotification(false, 'Removed Successfully!')
            }else{
                setNotification(true, 'Something went wrong!')
            }
        }catch(err){
            setNotification(true, err.message)
            console.log("Errr",err)
        }
    };

    const changeAlt = async (id,alt) => {
        try{
            let formData = new FormData()
            formData.append('alt',alt)
            formData.append('id',id)
            formData.append('product_id',productId)
      
            const {data,status} = await mernDashApi.put('/api/products/media/altChange',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if(status === 200){
                setMedias(data.medias)
                setNotification(false, 'Alt updated!')
            }else{
                setNotification(true, 'Something went wrong!')
            }
          }catch(err){
              setNotification(true, err.message)
              console.log("Errr",err)
          }
    }

    useEffect(()=>{
        const getMedias = async ()=>{
          const {data,status} = await mernDashApi.get('/api/products/media/'+productId)
          const {medias} = data
          if(status === 200){
            setMedias(medias)
            setIsLoading(false)
          }
        }
        getMedias()
    },[])

  if(isLoading) return <ContentLoader/>

  return (
    <div>
          <Preview
            medias={medias}
            uploadMedia={uploadMedia}
            updateOrder={updateOrder}
            changeAlt={changeAlt}
            deleteImage={deleteImage}
          />
    </div>
  )
}

export default Medias