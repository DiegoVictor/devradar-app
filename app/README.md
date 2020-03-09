# About
This app permit users to booking spots from companies to specified date, be notified when the request is approved or rejected and see all requests made and its current status<br /><br />
<img src="https://raw.githubusercontent.com/DiegoVictor/omnistack-9/master/app/screenshots/dashboard.jpg" width="24%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/omnistack-9/master/app/screenshots/book.jpg" width="24%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/omnistack-9/master/app/screenshots/calendar.jpg" width="24%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/omnistack-9/master/app/screenshots/booked.jpg" width="24%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/omnistack-9/master/app/screenshots/approved.jpg" width="24%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/omnistack-9/master/app/screenshots/bookings.jpg" width="24%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/omnistack-9/master/app/screenshots/canceled.jpg" width="24%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/omnistack-9/master/app/screenshots/login.jpg" width="24%" />

# OS
This app was tested only with Android through USB connection, is strongly recommended to use the same operational system, but of course you can use an emulator or a real device connected through wifi or USB.

# Install
```
$ yarn
```

# Dependencies
Was installed and configured the `eslint` and `prettier` to keep the code clean and patterned.

# Reactotron
This project is configured with [Reactotron](https://github.com/infinitered/reactotron), just open the Reactotron GUI before the app is up and running, after start the app Reactotron will identify new connections.
> If Reactotron show an empty timeline after the app is running try run `adb reverse tcp:9090 tcp:9090`, then reload the app.

# .env
Rename the `.env.example` to `.env` then just update with yours settings

# API
Start the server in the [`api`](https://github.com/DiegoVictor/omnistack-8/tree/master/api) folder (see its README for more information). If any change in the api's port or host was made remember to update the `.env` too.
> Also, maybe you need run reverse again but this time to the api: `adb reverse tcp:3333 tcp:3333`

# Start up
The first build must be through USB connection, so connect your device (or just open your emulator) and run:
```
$ yarn react-native run-android
```

In the next times you can just run the Metro Bundler server:
```
$ yarn start
```

# Tests
```
$ yarn test
```
