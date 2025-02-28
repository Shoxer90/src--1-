import { memo } from "react";
import AdminLogin from "./auth/AdminLogin";
const AdminPage = () => {

  return(
    <div>
      <AdminLogin />
    </div>
  )
};

export default memo(AdminPage);
