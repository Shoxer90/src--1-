import { memo } from "react";
import { useTranslation } from "react-i18next";

const AdminTitle = ({title, subTitle}) => {
	const {t} = useTranslation();
	return(
		<div>
			{title ? <h3>{t(`${title}`).toUpperCase()}</h3>:""}
			{subTitle ? <h5>{t(`${subTitle}`).toUpperCase()}</h5>: ""}
		</div>
	)
};

export default memo(AdminTitle);
