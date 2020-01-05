# About
This app version permit to user like or dislike another users and see previous matches.<br /><br />
<img src="https://i.ibb.co/g6T8tr0/login.png" width="32%" />
<img src="https://i.ibb.co/XZ7C3zh/dashboard.png" width="32%" />
<img src="https://i.ibb.co/cw8RLd0/menu.png" width="32%" />
<img src="https://i.ibb.co/vc9pDqz/matches.png" width="32%" />
<img src="https://i.ibb.co/svRJbKp/match.png" width="32%" />


# Dependencies
Was installed and configured the `eslint` and `prettier` to keep the code clean and patterned.

# .env
Rename the .env.example to .env then just update with yours settings

# Reactotron
This project is configured with [Reactotron](https://github.com/infinitered/reactotron), just open the Reactotron GUI before the app is up and running, after start the app Reactotron will identify new connections.

# API
Start the server in the [`api`](https://github.com/DiegoVictor/omnistack-8/tree/master/api) folder (see its README for more information). If any change in the api's port or host was made remember to update the `.env` too.

# Start up
```
$ yarn react-native run-android
```
> This app was tested only with Android through USB connection, is strongly recommended to use the same operational system, but of course you can use an emulator or a real device connected through wifi or USB. Of course you can test on an iOS device, but there is no guarantee that the app will work as expected!


# Tests
```
$ yarn test
```
