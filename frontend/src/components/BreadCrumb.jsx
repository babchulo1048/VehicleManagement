import { useLocation } from 'react-router-dom';
import { routes } from './Routes';
export const useBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const findRoute = (path, routeList) => {
    for (const route of routeList) {
      if (route.path === path) return route;
      if (route.children) {
        const childRoute = findRoute(path, route.children.map((child) => ({
          ...child,
          path: `${route.path}/${child.path}`.replace(/\/\//g, '/'), // Ensure proper nesting
        })));
        if (childRoute) return childRoute;
      }
    }
    return null;
  };

  const breadcrumbs = pathnames.map((_, index) => {
    const path = `/${pathnames.slice(0, index + 1).join('/')}`;
    const route = findRoute(path, routes);

    return route
      ? { label: route.label, link: path }
      : null;
  }).filter(Boolean);

  return breadcrumbs;
};
