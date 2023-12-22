import React, { memo } from "react";
import styles from "./index.module.scss";

const ImageUser = ({img}) => {
  return (
    <div className={styles.imageUser_div}>
     <img 
        src="https://sugargeekshow.com/wp-content/uploads/2020/10/baked_donut_recipe_featured.jpg"
        // original
        // src={img || "/defaultAvatar.png"}
        // cashiers
        // src="/photo_2023-12-19_15-47-17.jpg"
        alt="user_photo_jpg"
        className={styles.imageUser_div_img}
     />
    </div>
  )
};

export default memo(ImageUser);
