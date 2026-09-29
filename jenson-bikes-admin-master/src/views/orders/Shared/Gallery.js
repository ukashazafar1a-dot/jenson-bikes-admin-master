import React, { useEffect,useState } from 'react'
import fileDownload from 'js-file-download'
import {saveAs} from 'file-saver'
import JSZip from 'jszip'
import axios from 'axios'
import { CSpinner } from '@coreui/react'

function Gallery({files,showType=false}) {

    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownload = (url, filename) => {
        let path = url.includes('https') ? url : url.replace('http','https');
        axios.get(path, {
          responseType: 'blob',
        })
        .then((res) => {
          fileDownload(res.data, filename)
        })
    }

    function download(file){
        if(!file?.path) return;
        let path = file.path.includes('https') ? file.path : file.path.replace('http','https')
        let extension = path.split('.').pop();
        if(extension){
            handleDownload(path, file.name)
        }
    }

    function renderFileType(file){
        if(!file.name || !file.path) return;
        //For Document printings
        if(file.name.includes('color_print.')){
            return <h6>Color Print</h6>
        }else if(file.name.includes('black_white_print.')){
            return <h6>Black And White Print</h6>
        }
        //For Photo printings
        let type = file.name.split('_').pop().split('.')[0];
        if(type) return <h6>{type}</h6>

    }

    function downloadAll(){
        if(!files) return;
        setIsDownloading(true)
        const zip = new JSZip();
        const folder = zip.folder("files");

        files?.forEach((file) => {
            let path = file?.path.includes('https') ? file.path : file?.path.replace('http','https')
            const blobPromise = fetch(path).then((r) => {
                if (r.status === 200) return r.blob();
                return Promise.reject(new Error(r.statusText));
            });
            const name = file.name;
            folder.file(name, blobPromise);
        });
    
        zip.generateAsync({ type: "blob" }).then((blob) => {
            setIsDownloading(false)
            saveAs(blob, 'all_files.zip')
        });
    }

    return (
        <div
        id="carouselMultiItemExample"
        className="carousel-dark text-center mt-4"
        >
        <div className="d-flex justify-content-between mb-4">
            <h3>Files</h3>
            <button className='btn btn-secondary' onClick={()=>downloadAll()} disabled={isDownloading}>
                {isDownloading ? (
                    <CSpinner variant='grow' style={{width:'1.25rem',height: '1.25rem'}}/>
                ) : ('Download All')}
            </button>
        </div>
        <div className="py-4">
            <div className="container">
                <div className="row">
                    {files && files.map((file)=>{
                        return (
                            <div className="col-lg-4 my-3">
                                <div className="card">
                                <div className='pic-card' style={{backgroundImage: `url(${file?.path})`}}>
                                    {file?.name && <h6 className='pic-card__pill'>{'.'}{file?.name.split('.').pop()}</h6>}
                                </div>
                                <div className="card-body">
                                    {file?.name && <h5 className="card-title" title={file?.name}>{file?.name.slice(0,30)+'...'}</h5>}
                                    {showType && renderFileType(file)}
                                    {file.count && <p className="card-text">
                                     {file?.count}{' '}{'Copie(s)'}
                                    </p>}
                                    <a href="#!" className="btn btn-primary" onClick={()=>download(file)}>Download</a>
                                </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
        </div>
  )
}

export default Gallery