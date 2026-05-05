import { Badge, IconButton, Tooltip } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const OpenBtn = ({ clickFunc, buttonRef, notificationCount, open }) => {
  const { t } = useTranslation();
  const menuOpen = Boolean(open);
  const hasUnread = notificationCount > 0;

  return (
    <Tooltip title={t("menubar.notificationsTitle")} placement="bottom" arrow enterTouchDelay={400}>
      <IconButton
        ref={buttonRef}
        onClick={clickFunc}
        aria-label={t("menubar.notificationsTitle")}
        size="medium"
        disableRipple={false}
        sx={{
          padding: "10px",
          margin: 0,
          color: menuOpen ? "#FFA500" : "#3FB68A",
          verticalAlign: "middle",
          transition: "color 0.2s ease, background-color 0.2s ease, transform 0.15s ease",
          "&:hover": {
            backgroundColor: "rgba(63, 182, 138, 0.12)",
            color: menuOpen ? "#FFB020" : "#2d9a6e",
          },
          "&:active": {
            transform: "scale(0.95)",
            backgroundColor: "rgba(63, 182, 138, 0.2)",
          },
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          badgeContent={hasUnread ? notificationCount : undefined}
          color="warning"
          invisible={!hasUnread}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.7rem",
              fontWeight: 700,
              minWidth: 20,
              height: 20,
              padding: "0 6px",
              right: 4,
              top: 4,
              boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
              border: "2px solid #fff",
            },
          }}
        >
          {hasUnread ? (
            <NotificationsActiveIcon
              sx={{
                fontSize: 28,
                display: "block",
                filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.06))",
              }}
            />
          ) : (
            <NotificationsIcon
              sx={{
                fontSize: 28,
                display: "block",
                filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.06))",
              }}
            />
          )}
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default memo(OpenBtn);
