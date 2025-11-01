import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/router";
import type { inferRouterOutputs, inferRouterInputs } from "@trpc/server";

export const trpc = createTRPCReact<AppRouter>();

export type inferQueryOutput<TRouteKey extends string> =
  TRouteKey extends keyof inferRouterOutputs<AppRouter>
    ? inferRouterOutputs<AppRouter>[TRouteKey]
    : never;

export type inferQueryInput<TRouteKey extends string> =
  TRouteKey extends keyof inferRouterInputs<AppRouter>
    ? inferRouterInputs<AppRouter>[TRouteKey]
    : never;

export type inferMutationOutput<TRouteKey extends string> =
  TRouteKey extends keyof inferRouterOutputs<AppRouter>
    ? inferRouterOutputs<AppRouter>[TRouteKey]
    : never;

export type inferMutationInput<TRouteKey extends string> =
  TRouteKey extends keyof inferRouterInputs<AppRouter>
    ? inferRouterInputs<AppRouter>[TRouteKey]
    : never;
