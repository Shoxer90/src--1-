import React, { memo } from "react";
import { Card } from "@mui/material";

import styles from "./index.module.scss";

 const SettingsCard = ({
  leftTop,
  rightTop,
  leftBottom,
  rightBottom,
  func
}) => {
  return(
    <Card 
      className={styles.settingsCard} 
      sx={{boxShadow:4,borderRadius:4}}
      onClick={func}
      style={{position:"relative",zIndex:1}}
    >
      {leftTop}
      {rightTop}
      {leftBottom}
      {rightBottom}
    </Card>
  )
 };

export default memo(SettingsCard);
