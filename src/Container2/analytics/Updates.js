  import { Card } from '@mui/material';
  import React,{useState} from 'react'
  import { memo } from 'react';
  import ChangeAnalyses from './ChangeAnalyses';

  import styles from "./index.module.scss";

  const Updates = ({updates, t}) => {

  const [open, setOpen] = useState(false);
  const [changes, setChanges] = useState([]);
  const [name, setName] = useState("");

  const updateItemClick = async(identify, string) => {
    setName(string)
    setOpen(true)
    const handleArr = await updates.filter(item => item.id === identify)
    setChanges(
      ...handleArr
    )
  };
  
  return (
      <div className={styles.products_update}>
        {updates.map((el,i) => (
          <Card 
            key={i}
            onClick={()=>updateItemClick(el?.id, el?.name)}
            style={{ 
              borderRadius: "10px",
              padding: 3,
              margin: 5, 
              boxShadow: 12,
              width: "300px",
              height: "150px",
              fontSize: "80%"
            }}
          >
          <div 
            className={styles.products_update_item} 
            onClick={()=>updateItemClick(el?.id, el?.name)}
          >
            <h6  style={{fontSize: el.name?.length > 25? "75%": "100%"}}>{el?.name?.length > 45 ? el.name.slice(0,45)+ "..." : el?.name } / { el?.brand }</h6>
            <div className={styles.products_update_card}>
                <img 
                  style={{width:"125px",height:"100px",margin:"0 10px 10px 10px",objectFit:"cover",borderRadius:"8px"}} 
                  src={el?.photo || "/default-placeholder.png"}
                  alt="prod pic"
                />
              <div className={styles.products_update_card_info}>
                <div> {t("productinputs.count")}:  {el.remainder}  {t(`units.${el.measure}`)}</div>
                <div> {t("productinputs.price")}:  {el.price } {t("units.amd")}</div>
                <div> {t("productinputs.purchase")}:  {el.purchasePrice} {t("units.amd")}</div>
              </div>
            </div>

           </div>
          </Card>
        ))}
      <ChangeAnalyses
        t={t} 
        open={open} 
        name={name}
        setOpen={setOpen} 
        content={changes.changes} 
      />
      </div>
  )
};

export default memo(Updates);
