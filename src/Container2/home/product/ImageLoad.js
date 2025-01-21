import React, { memo } from "react";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import styles from "../index.module.scss";

const ImageLoad = ({func,setProduct, newProduct, content}) => (

  <div className={styles.imageUpload_avatar}>
     <div className={styles.imageUpload_avatar_removeImg}>
      <DeleteIcon 
        sx={{":hover":{background:"#d6d3d3",borderRadius:"2px"}}}
        onClick={()=>setProduct({...newProduct, photo:""})}
       />
      <input 
        id="file-input" 
        type="file" 
        style={{display:"none"}} 
        onChange={(e)=>func(e)}
      />
    </div>
    <img 
      src={content || "/default-placeholder.png"}
      alt="prod default"
    />
    <div className={styles.imageUpload_avatar_input}>
      <label htmlFor="file-input">
        <AddAPhotoIcon />
      </label>
      <input 
        id="file-input" 
        type="file" 
        style={{display:"none"}} 
        onChange={(e)=>func(e)}
      />
    </div>
  </div>
);

export default memo(ImageLoad);


