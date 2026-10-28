import { usePos } from "../PosContext";
import { qtyStep } from "../cartMath";

export function useCart() {
  const pos = usePos();
  const { lines, alert, lastAdded, draftNo } = pos.state.cart;
  const selected = pos.state.ui.selectedLine;

  return {
    lines,
    alert,
    lastAdded,
    draftNo,
    selected,
    totals: pos.totals,
    parked: pos.state.ui.parked,
    addProduct: pos.addProduct,
    setQty: pos.setQty,
    removeLine: pos.removeLine,
    clearCart: pos.clearCart,
    parkCart: pos.parkCart,
    resumeParked: pos.resumeParked,
    stepSelected: (direction: 1 | -1) => {
      const line = lines[selected];
      if (!line) return;
      pos.setQty(line.product.id, line.qty + qtyStep(line.product.measure) * direction);
    },
    moveSelected: (direction: 1 | -1) => {
      if (!lines.length) return;
      const next = Math.min(lines.length - 1, Math.max(0, selected + direction));
      pos.dispatch({ type: "ui", ui: { selectedLine: next } });
    },
    selectLine: (index: number) => pos.dispatch({ type: "ui", ui: { selectedLine: index } }),
    dismissAlert: () => pos.dispatch({ type: "cart", cart: { alert: "" } }),
  };
}
