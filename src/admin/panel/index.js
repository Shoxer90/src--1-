import { memo, useEffect, useState } from "react";
import LeftNavigation from "../navigation";
import AdminTitle from "../modules/AdminTitle";

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
      <LeftNavigation setTitle={setTitle} />
      <div  className={styles.admin_page_right}>
        <AdminTitle title={title?.title} subTitle={title?.subTitle} />
        {children}
      </div>
      {/* pagination */}
    </div>
  )
};

export default memo(AdminPanel);
