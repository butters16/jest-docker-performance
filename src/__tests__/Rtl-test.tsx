import React from "react";
import { render, screen } from "@testing-library/react";

it("RTL", async () => {
  render(<h1>Anything</h1>);
  expect(screen.getByRole("heading")).toHaveTextContent("Anything");
});
