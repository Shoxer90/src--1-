import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PosProvider } from "./PosContext";
import { PosLayout } from "./components/PosLayout";

jest.mock("./api", () => ({
  loadCategories: async () => [],
  loadProductPage: async () => ({ items: [], total: 0 }),
  searchCatalog: async () => [],
  loadOpenPrepaymentCount: async () => 3,
}));

function renderPos(isAdmin: boolean) {
  return render(
    <MemoryRouter>
      <PosProvider cashierKey="cashier-1">
        <PosLayout
          user={{ firstname: "Անի", lastname: "Գալստյան", legalName: "Խանութ ՍՊԸ", isEhdmStatus: true }}
          isAdmin={isAdmin}
          canReverse={false}
          onLogout={() => undefined}
          onScan={() => undefined}
          onConfirm={() => undefined}
        />
      </PosProvider>
    </MemoryRouter>
  );
}

test("cashier sale screen shows the Armenian POS and hides admin tools", async () => {
  renderPos(false);
  expect(await screen.findByPlaceholderText("Շտրիխ-կոդ, ներքին կոդ կամ անուն")).toBeInTheDocument();
  expect(screen.getByText("Ընթացիկ վաճառք")).toBeInTheDocument();
  expect(screen.getByText("Վճարման ենթակա")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Վաճառք · F9" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Կանխավճար" })).toBeDisabled();
});
