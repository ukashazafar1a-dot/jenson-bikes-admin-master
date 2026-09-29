import { CFormCheck } from "@coreui/react";
import React, { Component, Fragment } from "react";
import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import ImageEditModal from "./ImageEditModal";

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      dragId: "",
      openEditModal: false,
      imageToEdit: null
    };
  }

  componentDidMount() {
    const { medias } = this.props;
    this.setState({
      images: medias
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.medias !== state.images) {
      return {
        images: props.medias
      };
    }
    return null;
  }

  filesSelectedHandler =async (e) => {
      const { uploadMedia } = this.props;
      const files = Array.from(e.target.files);
      await uploadMedia(files);

  };

  deleteImage = (e,id) => {
    e.preventDefault()
    e.stopPropagation()
    const { deleteImage } = this.props;
    deleteImage(id);
  };

  handleOver = (ev) => {
    ev.preventDefault();
  };

  handleDrag = (ev) => {
    this.setState({
      dragId: ev.currentTarget.id
    });
  };

  handleDrop = (ev) => {
    ev.preventDefault();
    const { images } = this.state;
    const { dragId } = this.state;
    const { updateOrder } = this.props
    const dragImage = images.find((image) => image.position == dragId);
    const dropImage = images.find(
      (image) => {
            return image.position == ev.currentTarget.id
        }
    );
    const arr = this.moveItem(dragImage.position - 1, dropImage.position - 1);

    if(arr.length > 0){
      arr.map((items,index)=>{
        items.position = index + 1
      })
    }
    if(dropImage.position != dragImage.position){
      updateOrder(arr)
    }
    
    this.setState({
      images: arr
    });
  };

  moveItem(from, to) {
    const { images } = this.state;
    const f = images.splice(from, 1)[0];
    images.splice(to, 0, f);
    return images;
  }

  setOpenEditModal = (value)=>{
    this.setState({
      openEditModal: value
    })
  }

  handleImageEdit = (e,image)=>{
    e.preventDefault()
    this.setState({
      imageToEdit: image,
      openEditModal: true
    })
  }

  onAltChange = (id,alt)=>{
    const { changeAlt } = this.props
    changeAlt(id,alt)
  }

  renderPreview() {
    const { images,openEditModal,imageToEdit } = this.state;

    return (
      <Fragment>
          <ImageEditModal open={openEditModal} setOpen={this.setOpenEditModal} image={imageToEdit} onAltChange={this.onAltChange}/>
                <div className="Rf-dropzone">
                    <div className="Rf-dropzone--contianer">
                        <div className="Rf-dropzone--inner">
                            <div className="Rf-dropzone--gallery">
                                {images.length > 0 &&
                                    images.map((element, index) => {
                                        return (
                                        <div className="Rf-dropzone--gallery-item" key={index}
                                            id={element.position}
                                            draggable
                                            onDragOver={(e) => this.handleOver(e)}
                                            onDragStart={(e) => this.handleDrag(e)}
                                            onDrop={(e) => this.handleDrop(e)}>
                                            <button className="mxLa4" onClick={(e)=> this.handleImageEdit(e,element)}>
                                                <div class="DGLQS">
                                                </div>
                                                {/* <div style={{position:'absolute',top:'0',zIndex:'99'}}>{element.position}</div> */}
                                                <div className="ZTs54">
                                                    <img
                                                    src={element.src}
                                                    alt={element.alt}
                                                     className="EYJnU"
                                                    />
                                                </div>
                                                <div class="fRx9t" style={{color:'white'}}>
                                                   <CIcon icon={cilTrash} onClick={(e)=>this.deleteImage(e,element._id)}/>
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                                <div class="nGcDV v9JCO">
                                    <div class="MsoaY">
                                        <span>Add Images</span>
                                        <input
                                            type="file"
                                            name="file"
                                            onChange={this.filesSelectedHandler}
                                            accept="image/*"
                                            multiple
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
      </Fragment>
    );
  }

  render() {
    const { images } = this.state;
    return <div>{this.renderPreview()}</div>;
  }
}

export default Preview;
