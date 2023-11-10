import React from "react";
import { memo } from "react";

const SocialItem = ({url,children}) => {
    return (
        <a href={url} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
            {children}
        </a>
    )
};

export default memo(SocialItem);
