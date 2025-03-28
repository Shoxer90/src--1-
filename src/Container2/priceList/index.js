import React, { memo } from "react";
import { motion } from "framer-motion";

import PriceTable from "./Table";

import styles from "./index.module.scss";
import { Button } from "@mui/material";
import { MPageTitle } from "./title";
import { useTranslation } from "react-i18next";
const titleAnimation = {
  hidden:{
    y: -100,
    opacity: 0
  },
  visible: custom => ({
    y: 0,
    opacity: 1,
    transition: {delay: custom * 0.8}
  })
}
 const MButton = motion(Button);
 const annotationAnimation = {
  hidden:{
    x: 100,
    opacity: 0
  },
  visible: custom => ({
    x: 0,
    opacity: 1,
    transition: {delay: custom * 0.8}
  })
 }

const PriceList = () => {
    const {t} = useTranslation();

  return(
    <motion.div 
      id="section-3"
      initial="hidden"
      whileInView="visible"
    //   style={{paddingTop:"70px",height:"90vh", margin:"40px 0px"}}
      style={{paddingTop:"70px",height:"90vh"}}
    >
      <MPageTitle variants={titleAnimation} custom={1} title={t("landing.priceListTitle")} />

      <div className={styles.prices}>
        <PriceTable t={t} />
        {/* <MButton
          variants={annotationAnimation}
          custom={2}
          variant="contained"
          onClick={()=> setIsRegistrate(1)}

          sx={{height:"50px", width:"150px",borderRadius:"8px",margin:"auto 40px", background:"#3FB68A"}}
        >
          {t("authorize.registration")}
        </MButton> */}
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={annotationAnimation}
        custom={1.2}
        className={styles.annotation}
      >
        <span>{t("landing.priceListStars1")}</span>
        <span>{t("landing.priceListStars2")}</span>
      </motion.div>
    </motion.div>
  )
};

export default memo(PriceList);