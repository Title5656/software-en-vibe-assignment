import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { afterEach, expect, it } from "vitest";
import { ActivitiesPage } from "@/routes/activities";

afterEach(cleanup);

it("can select Monday immediately from the initial full-week view", async () => {
  const root = createRootRoute({ component: ActivitiesPage });
  const router = createRouter({ routeTree: root, history: createMemoryHistory({ initialEntries: ["/"] }) });
  await act(async () => { await router.load(); });
  render(<RouterProvider router={router} />);
  await waitFor(() => expect(screen.getAllByRole("article")).toHaveLength(7));
  const monday = screen.getAllByRole("article")[0]!.querySelector("time")!.dateTime;
  fireEvent.change(screen.getByLabelText("Choose a date"), { target: { value: monday } });
  await waitFor(() => expect(screen.getAllByRole("article")).toHaveLength(1));
  expect(screen.getByRole("heading", { name: "Monday" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Show whole week" })).toBeInTheDocument();
});
