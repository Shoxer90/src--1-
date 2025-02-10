import { memo, useEffect, useState } from "react";

import AdminTitle from "../modules/AdminTitle";
import Navigation from "../navigation";

import styles from "./index.module.scss";

const AdminPanel = ({children}) => {

  const [title,setTitle] = useState({
    title:"",
    subTitle:""
  });

   useEffect(() => {
    !title?.title && setTitle({title:"Glavnaya stranica"})
   },[])

  return(
    <div className={styles.admin_page}>
      <Navigation setTitle={setTitle} />
      <AdminTitle title={title?.title} subTitle={title?.subTitle} />
      {children}
    </div>
  )
};

export default memo(AdminPanel);
