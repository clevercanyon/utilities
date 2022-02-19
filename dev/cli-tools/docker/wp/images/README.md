## Image Setup Instructions:

CD into this directory.

```
$ cd ./dev/cli-tools/docker/wp/images
```

First untag each of the existing images so we can add new ones.

```
$ docker rmi jaswrks/wp-docker:php8.1-apache
$ docker rmi jaswrks/wp-docker:php8.0-apache
$ docker rmi jaswrks/wp-docker:php7.4-apache
```

Start each of the projects. When builds complete, press Ctrl-C to exit and stop.

```
$ docker compose --project-name=wp-docker-php8.1-apache --file php8.1.yml up
$ docker compose --project-name=wp-docker-php8.0-apache --file php8.0.yml up
$ docker compose --project-name=wp-docker-php7.4-apache --file php7.4.yml up
```

Commit the images.

```
$ docker commit wp-docker-php8.1-apache jaswrks/wp-docker:php8.1-apache
$ docker commit wp-docker-php8.0-apache jaswrks/wp-docker:php8.0-apache
$ docker commit wp-docker-php7.4-apache jaswrks/wp-docker:php7.4-apache
```

Push the images to Docker Hub.

```
$ docker push jaswrks/wp-docker:php8.1-apache
$ docker push jaswrks/wp-docker:php8.0-apache
$ docker push jaswrks/wp-docker:php7.4-apache
```

Remove each of the projects now.

```
$ docker compose --project-name=wp-docker-php8.1-apache --file php8.1.yml rm --volumes --force
$ docker compose --project-name=wp-docker-php8.0-apache --file php8.0.yml rm --volumes --force
$ docker compose --project-name=wp-docker-php7.4-apache --file php7.4.yml rm --volumes --force
```
