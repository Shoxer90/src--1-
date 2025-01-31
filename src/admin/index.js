import { memo, useState } from "react";

import AdminLogin from "./auth/AdminLogin";
import AdminPanel from "./panel";

const AdminPage = () => {
  const [isAdminLogin, setIsLoginAdmin] = useState(false);

  return(
    <div>
      {/* {isAdminLogin ? */}
        <AdminLogin />
        {/* : */}
        {/* <AdminPanel /> */}
      {/* } */}
    </div>
  )
};

export default memo(AdminPage);
