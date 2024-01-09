import React, { memo } from  "react";
import { useTranslation } from "react-i18next";

const IsInDate = () => {
  const {t} = useTranslation();
  const style = {
    padding: "20px",
    fontSize: "110%",
    fontWeight: 600,
  }

  return (
    <div style={style}>
      <p>{t("dialogs.isInDate")}</p>
    </div>
  )
};

export default memo(IsInDate);
