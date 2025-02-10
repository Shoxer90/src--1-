import React, { memo, useEffect, useState } from "react";
import { Slide } from "@mui/material";
import styles from "../index.module.scss";
import PrepaymentItem from "./PrepaymentItem";
import { useTranslation } from "react-i18next";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const activeStyle = {
  boxShadow: "10px 5px 5px grey",
  scale:"1.04",
  transition: "width 2s",
};

const PrepaymentConfirmation = ({setBills, billsData, price }) => {
  const [activeRow,setActiveRow] = useState(0);
  const {t} = useTranslation();

  const subscriptionData = [
    {
      months: 1,
      price: price * 1
    },
    {
      months: 2,
      price: price * 2
    },
    {
      months: 3,
      price: price * 3
    },
    {
      months: 4,
      price: price * 4
    }
  ];

  const activateRow = (row) => {
    if(activeRow === row){
      setActiveRow(0)
    }else{
      setActiveRow(row)
    }
  };

  useEffect(() =>{
    activateRow(1)
    billsData && setBills({
      ...billsData,
      daysEnum: 1
    })
  }, []);

  return(
    <>
      <div  className={styles.subscription}>
        {
          subscriptionData && subscriptionData.map((item,index) => (
            <PrepaymentItem
              {...item} 
              activeRow={activeRow}
              setActiveRow={setActiveRow}
              index={index}
              activeStyle={activeStyle}
              activateRow={activateRow}
              setPaymentData={setBills}
              paymentData={billsData}
            />
          ))
        }
      </div>
    </>
  )
};

export default memo(PrepaymentConfirmation);
