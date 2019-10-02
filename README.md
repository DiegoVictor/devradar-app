# Dependencies
Was installed and configured the `eslint` and `prettier` to keep the code clean and patterned.

# MongoDB (with docker)
```
$ docker run --name aircnc -d -p 27017:27017 mongo
$ docker start aircnc
```
> Windows user using Docker Toolbox maybe need set the mongodb host to `192.168.99.100` instead of `localhost`or `127.0.0.1`

# .env
Just update with yours settings

# Start Up
```
$ yarn dev
```
