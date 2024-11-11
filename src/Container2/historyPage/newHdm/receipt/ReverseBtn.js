import React, { memo } from "react";

import { Button } from "@mui/material";
import LowPriorityIcon from '@mui/icons-material/LowPriority';

const ReverseBtn = ({dialogManage,t}) => (
	<Button 
		onClick={dialogManage} 
		variant="contained" 
		sx={{
			bgcolor:"red",
			color:"white",
			margin:"0px 0px 4px 15px",
			width:"120px",
			alignSelf:"start"
		}}>
		<LowPriorityIcon />
		<p style={{fontSize:"80%",alignSelf:"center", margin:0}}>
			{t("history.reverse")}
		</p>
	</Button>
);

export default memo(ReverseBtn);
