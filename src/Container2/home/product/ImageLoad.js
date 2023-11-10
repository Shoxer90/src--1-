import React, { memo } from "react";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import styles from "../index.module.scss";

const ImageLoad = ({func, content}) => (

  <div className={styles.imageUpload_avatar}>
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
