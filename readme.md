# Global Chat App

# About env file
A file named .env must be created within main working directory in which backend.js is present and that .env file should have following key with proper values :-

```
IP="0.0.0.0"
PORT=8080
MONGODB_URL=""
APP_SECRET_KEY=""
```

* IP and PORT is already given by default if you do like to change so you can.
* Mongodb url should be connection string of your mongodb (atlas).
* Put any long alphanumeric string as value of APP_SECRET_KEY to insure server security or you can go to [UUID GENERATOR](https://www.uuidgenerator.net/) and copy an random UUID and put it here. It will work fine.