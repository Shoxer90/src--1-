import { memo } from "react";

export const isOnMarketX = (product) => {
  const flag = product?.showInMarketX ?? product?.ShowInMarketX;
  if (flag === true || flag === "true" || flag === 1 || flag === "1") return true;
  const photos = product?.photos ?? product?.Photos;
  return Array.isArray(photos) && photos.length > 0;
};

const MarketXBadge = () => (
  <img
    src="/marketx-logo.png"
    alt="MarketX"
    style={{
      position: "absolute",
      top: 4,
      left: 4,
      width: 28,
      height: 28,
      objectFit: "contain",
      background: "rgba(255,255,255,0.94)",
      borderRadius: 7,
      padding: 2,
      boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
      zIndex: 2,
      pointerEvents: "none",
    }}
  />
);

export default memo(MarketXBadge);
