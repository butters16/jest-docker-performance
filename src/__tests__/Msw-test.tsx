//
// Cobbled together from the example on https://redux-toolkit.js.org/rtk-query/overview
//

// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { Pokemon } from "./types";
type Pokemon = {
  name: string;
  base_experience: number;
};

// Define a service using a base URL and expected endpoints
export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  //   baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v2/" }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name}`,
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery } = pokemonApi;

import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
// import { pokemonApi } from "./services/pokemon";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
// import { useGetPokemonByNameQuery } from "./services/pokemon";

export default function App() {
  // Using a query hook automatically fetches data and returns query values
  const { data, error, isLoading } = useGetPokemonByNameQuery("bulbasaur");
  // Individual hooks are also accessible under the generated endpoints:
  // const { data, error, isLoading } = pokemonApi.endpoints.getPokemonByName.useQuery('bulbasaur')

  // render UI based on data and loading state
  if (isLoading) {
    return <h1>loading</h1>;
  } else if (error) {
    console.log("error", error);
    return <h1>error</h1>;
  }
  return (
    <>
      <h1>{data?.name}</h1>
      <h2>{data?.base_experience}</h2>
    </>
  );
}

import { rest } from "msw";
import { setupServer } from "msw/node";
describe("MSW", () => {
  const server = setupServer(
    rest.get("/api/v2/pokemon/:name", (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ name: "some name", base_experience: 123 }));
    }),
  );

  beforeAll(() => {
    // Enable the mocking in tests.
    server.listen();
  });

  afterEach(() => {
    // Reset any runtime handlers tests may use.
    server.resetHandlers();
  });

  afterAll(() => {
    // Clean up once the tests are done.
    server.close();
  });

  it("MSW", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    screen.getByRole("heading", { name: /loading/i });
    await screen.findByRole("heading", { name: /some name/i });
    await screen.findByRole("heading", { name: /123/i });
  });
});
