# Notes-App

## TODO:

-   [x] Basic functionality for server side rendering
-   [x] ACL via passportjs and [google oauth2.0 stategy](https://github.com/jaredhanson/passport-google-oauth2)
-   [x] Integrate ACL with server side rendering
-   [x] Basic rest api with Koa
-   [x] Use [sequelize](https://github.com/sequelize/sequelize/) as orm for connecting to [PostgreSQL](https://www.postgresql.org/) database
-   [x] Select cloud database provider for PostgreSQL
-   [x] Select cloud file storage provider (with ability to stream file data when upload/download)
-   [x] Integrate with Dropbox API
-   [x] Decouple API and UI services
-   [x] [Dockerize](https://docs.docker.com/get-started/part2/#dockerfile) an application
-   [x] Use [Kompose](http://kompose.io/) to migrate from [docker-compose](https://docs.docker.com/compose/) to [Kubernetes](https://kubernetes.io/)
-   [ ] Use [Helm](https://helm.sh/) to pack whole app and test it localy
-   [ ] Setup and configure [Jenkins](https://github.com/helm/charts/tree/master/stable/jenkins) on AWS EC2 instance
-   [ ] Explore where you can build new versions of Docker images for each service (TravisCI?)
-   [ ] Setup basis for E2E testing with [Nightwatch](http://nightwatchjs.org/) in isolated docker-compose environment (database should be inside isolated environment)
-   [ ] Setup Continuous Integration with running E2E tests
-   [ ] Deploy to AWS
-   [ ] Setup Continuous Deployment to AWS (it should automatically deploy only when all CI checks are successfully passed)
