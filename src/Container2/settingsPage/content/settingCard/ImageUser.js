import React, { memo } from "react";
import styles from "./index.module.scss";

const ImageUser = ({img}) => {
  return (
    <div className={styles.imageUser_div}>
     <img 
        src={img || "/defaultAvatar.png"}
        alt="?"
        className={styles.imageUser_div_img}
     />
    </div>
  )
};

export default memo(ImageUser);
