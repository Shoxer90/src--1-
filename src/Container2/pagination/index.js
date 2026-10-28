import { memo } from "react";
import { Pagination, PaginationItem } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";

import styles from "./index.module.scss";

export const paginationSx = (compact) => ({
  "& .MuiPaginationItem-root": {
    fontWeight: 600,
    color: "#3a3a3a",
    borderRadius: "10px",
    minWidth: compact ? 30 : 36,
    height: compact ? 30 : 36,
  },
  "& .MuiPaginationItem-root:hover": {
    backgroundColor: "rgba(255, 165, 0, 0.16)",
  },
  "& .MuiPaginationItem-root.Mui-selected": {
    backgroundColor: "#FFA500",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#ffb01a",
    },
  },
});

const pageHref = (navigName, pageNumber) => {
  const raw = `${navigName || ""}`.replace(/^\//, "");
  const splitAt = raw.indexOf("?");
  const path = splitAt === -1 ? raw : raw.slice(0, splitAt);
  const params = new URLSearchParams(splitAt === -1 ? "" : raw.slice(splitAt + 1));
  if (!pageNumber || pageNumber <= 1) params.delete("page");
  else params.set("page", String(pageNumber));
  const query = params.toString();
  return `/${path}${query ? `?${query}` : ""}`;
};

const PaginationSnip = ({
  pageCount,
  page,
  navig_Name,
  perPage,
}) => {
  const compact = useMediaQuery("(max-width:600px)");
  const pages = Math.ceil(Number(pageCount) / (Number(perPage) || 1));
  if (!Number.isFinite(pages) || pages <= 1) return null;

  return (
    <div className={styles.pagination_container}>
      <Pagination
        page={Number(page) || 1}
        count={pages}
        siblingCount={compact ? 0 : 1}
        boundaryCount={1}
        shape="rounded"
        size={compact ? "small" : "medium"}
        renderItem={(item) => {
          if (item.type === "start-ellipsis" || item.type === "end-ellipsis") {
            return <PaginationItem {...item} />;
          }
          return (
            <PaginationItem
              component={Link}
              to={pageHref(navig_Name, item.page)}
              {...item}
              onClick={(event) => {
                item.onClick?.(event);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          );
        }}
        sx={paginationSx(compact)}
      />
    </div>
  );
};

export default memo(PaginationSnip);
