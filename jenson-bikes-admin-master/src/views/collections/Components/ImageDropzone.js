import React,{useEffect,useState} from 'react'
import { useDropzone } from 'react-dropzone';

function ImageDropzone({files,setFiles}) {
    const [thumbs,setThumbs] = useState(null);
    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            setFiles([...acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
            }))]);
        }
    });

    function onRemove(e,event) {
        e.stopPropagation();
        const fileToRemove = files.splice(files.indexOf(event), 1);
        const newFiles = files.map((file)=>{
            if(file !== fileToRemove ) return Object.assign(file,{
                preview: URL.createObjectURL(file)
            });
        })
        setFiles(newFiles);
    }

    function renderThumbs(){
        setThumbs(files?.map((file,i) => (
            <div key={file.name} className="thumb--img"  style={{margin:'auto'}}>
                {console.log(file.name,file.preview)}
                <img
                    src={file.preview}
                    key={i}
                    // Revoke data uri after image is loaded
                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />
                <div class="ng-star-inserted" className='custom-badge' onClick={(e)=>onRemove(e,file)}>
                    <svg style={{height: '10px',width: '10px'}}>
                        <line style={{stroke: '#fff',strokeWidth: '2px'}} x1="0" y1="0" x2="10" y2="10"></line>
                        <line style={{stroke: '#fff',strokeWidth: '2px'}} x1="0" y1="10" x2="10" y2="0"></line>
                    </svg>
                </div>
            </div>
        )))
    }

    useEffect(()=>{
        renderThumbs()
    },[files])

    useEffect(() => {
        setFiles([...files.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }))]);
        renderThumbs()
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, []);

    return (
        <div {...getRootProps({className: 'custom-dropzone selectForm'})} >
            <input {...getInputProps()} />
            {files.length <= 0 && <div style={{margin: '10px auto',textAlign: 'center',zIndex: '10'}}>
            <h2>Drop or browse files here</h2>
            </div>}
            {thumbs}
        </div>
    )
}

export default ImageDropzone