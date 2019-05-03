const nextRoutes = require('next-routes');

const routes = nextRoutes();

routes.add('home', '/');
routes.add('login', '/login');

module.exports = routes;
