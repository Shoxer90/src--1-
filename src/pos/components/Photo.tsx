import { useState, type ReactNode } from "react";

export function Photo({
  src,
  className,
  alt = "",
  children,
}: {
  src: string;
  className: string;
  alt?: string;
  children?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={className}>
      {!src || failed ? (
        <span>Նկար չկա</span>
      ) : (
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      )}
      {children}
    </div>
  );
}
