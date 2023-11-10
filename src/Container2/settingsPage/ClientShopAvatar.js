import React from "react";
import { memo } from "react";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import styles from "./index.module.scss";
import { updateLogo } from "../../services/user/getUser";

const ClientShopAvatar = ({client, setClient}) => {

  const handlePutPhoto = async(e) => {
    let reader = new FileReader();
    const file = e.target.files[0]
    reader.readAsDataURL(file)
    reader.onload = function(){
      updateLogo({"logo": reader.result})
      setClient({
        ...client,
        logo: reader.result
      })
    }
  }

  return(
    <div className={styles.settingsCont_avatar}>
      <img src={client?.logo || "/defaultAvatar.png"} alt="shop avatar" />
      <div className={styles.settingsCont_avatar_input}>
        <label htmlFor="file-input">
          <AddAPhotoIcon />
        </label>
        <input 
          id="file-input" 
          type="file" 
          style={{display:"none"}} 
          onChange={(e)=>handlePutPhoto(e)}
        />
      </div>
    </div>
  )
};

export default memo(ClientShopAvatar);
