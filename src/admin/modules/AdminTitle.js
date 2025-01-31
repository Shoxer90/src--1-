import { memo } from "react";

const AdminTitle = ({title, subTitle}) => {
	return(
		<div>
			<h1>{title}</h1>
			<h3>{subTitle}</h3>
		</div>
	)
};

export default memo(AdminTitle);
