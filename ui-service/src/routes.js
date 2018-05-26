const nextRoutes = require('next-routes');

const routes = nextRoutes();

routes.add('home', '/');

module.exports = routes;
