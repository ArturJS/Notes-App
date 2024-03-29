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
-   [x] Use [Helm](https://helm.sh/) to pack whole app and test it localy
-   [x] Migrate from Sequelize to Prisma
-   [ ] Setup and configure [Jenkins](https://github.com/helm/charts/tree/master/stable/jenkins) on AWS EC2 instance
-   [ ] Explore where you can build new versions of Docker images for each service (TravisCI?)
-   [ ] Setup basis for E2E testing with [Nightwatch](http://nightwatchjs.org/) in isolated docker-compose environment (database should be inside isolated environment)
-   [ ] Setup Continuous Integration with running E2E tests
-   [ ] Deploy to AWS
-   [ ] Setup Continuous Deployment to AWS (it should automatically deploy only when all CI checks are successfully passed)

<br>
<br>

## Kubernetes notes:

To start

-   `kompose convert -f docker-compose.yml`
-   `kompose up --build none`

To shutdown `kompose down`

To launch kubernetes dashboard `kubectl proxy`

## Issues and how to fix them:

-   "kompose build fails: unable to create tarball" -> rm -rf node_modules

-   "Error while deploying application: k.Transform failed: image key required withi
    n build parameters in order to build and push service" -> add `image` in docker-compose for each service

-   unable to push image to docker.io (docker login issue) -> [https://github.com/kubernetes/kompose/issues/911#issuecomment-390669560](https://github.com/kubernetes/kompose/issues/911#issuecomment-390669560)

-   expose minikube docker registry to localhost:5000 [https://blog.hasura.io/sharing-a-local-registry-for-minikube-37c7240d0615](https://blog.hasura.io/sharing-a-local-registry-for-minikube-37c7240d0615)

-   [https://forums.docker.com/t/docker-plugin-push-to-local-registry/35567/2](https://forums.docker.com/t/docker-plugin-push-to-local-registry/35567/2) # docker publish to local registry

-   `kompose up --build none` # to fix issue with docker login

-   `localhost:5000/image_name` instead of original `image_name`

-   expose existing service as LoadBalancer https://serverfault.com/a/818987

-   imagePullPolicy: Always [https://github.com/kubernetes/kubernetes/issues/33664#issuecomment-292895327](https://github.com/kubernetes/kubernetes/issues/33664#issuecomment-292895327)

-   `minikube start --vm-driver=none` [https://github.com/kubernetes/minikube/issues/2575](https://github.com/kubernetes/minikube/issues/2575)

-   kubernetes dashboard [https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)

*   microk8s sign in to dashboard [https://stackoverflow.com/questions/46664104/how-to-sign-in-kubernetes-dashboard](https://stackoverflow.com/questions/46664104/how-to-sign-in-kubernetes-dashboard)

*   uninstall minikube [https://github.com/kubernetes/minikube/issues/1043#issuecomment-354453842](https://github.com/kubernetes/minikube/issues/1043#issuecomment-354453842)

*   kompose with microk8s [https://github.com/ubuntu/microk8s/issues/197#issuecomment-440672817](https://github.com/ubuntu/microk8s/issues/197#issuecomment-440672817)

*   fix internet access from pods in microk8s [https://github.com/ubuntu/microk8s/issues/75#issuecomment-407363693](https://github.com/ubuntu/microk8s/issues/75#issuecomment-407363693)
