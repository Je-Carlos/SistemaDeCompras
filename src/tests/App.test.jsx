import React from "react";
import { render } from "@testing-library/react";
import App from "../App";

describe("App Component", () => {
  test("deve renderizar o componente Login na rota raiz", () => {
    const { getByText } = render(<App />);
    expect(getByText("Login")).toBeInTheDocument();
  });
});
