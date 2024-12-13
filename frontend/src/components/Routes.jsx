// routes.js
export const routes = [
    {
      path: '/admin',
      label: 'Dashboard',
      children: [
        { path: '', label: 'Home' },
        { path: 'orders', label: 'Orders' },
        { path: 'roles', label: 'Roles' },
        { path: 'permissions', label: 'Permissions' },
        { path: 'menu-items', label: 'Menu Items' },
        { path: 'categories', label: 'Categories' },
        { path: 'reservations', label: 'Reservations' },
        { path: 'users', label: 'Users' },
      ],
    },
  ];