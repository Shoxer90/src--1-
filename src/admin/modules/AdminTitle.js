import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const AdminTitle = ({notrans}) => {
	const titleData = useSelector((state) => state?.title)

	const {t} = useTranslation();
	return(
		<div>
			{notrans ?
			<h5>{titleData?.title}</h5>:
				<>
				{titleData?.title ? <h4>{t(`${titleData?.title}`).toUpperCase()}</h4>:""}
				
				{titleData?.subTitle ? <h5>{t(`${titleData?.subTitle}`).toUpperCase()}</h5>: ""}
				</> 
			}
		</div>
	)
};

export default memo(AdminTitle);
