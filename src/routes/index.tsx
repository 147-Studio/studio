import { lazy, LazyExoticComponent, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";

const Loader = (Component: LazyExoticComponent<() => JSX.Element>) => {
  return (props: JSX.IntrinsicAttributes) => (
    <Suspense>
      <Component {...props} />
    </Suspense>
  );
};

const Odyssey = Loader(lazy(() => import("@/pages/courses/odyssey")));
const Linux = Loader(lazy(() => import("@/pages/courses/linux")));
const NotFound = Loader(lazy(() => import("@/pages/not-found")));

export const routes: RouteObject[] = [
  {
    path: "/school/odyssey",
    element: <Odyssey />,
  },
  {
    path: "/school/linux",
    element: <Linux />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
