# About
This app permit users to find incidents and contact the incident's NGO by email or WhatsApp<br /><br />
<img src="https://raw.githubusercontent.com/DiegoVictor/omnistack/master/11/app/screenshots/splash.jpg" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/omnistack/master/11/app/screenshots/incidents.jpg" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/omnistack/master/11/app/screenshots/incident.jpg" width="32%" />

# OS
This app was tested only with Android through USB connection, is strongly recommended to use the same operational system, but of course you can use an emulator or a real device connected through wifi or USB.

# Install
```
$ yarn
```
> Was installed and configured the `eslint` and `prettier` to keep the code clean and patterned.

## app.json
Rename the `app.example.json` to `app.json` then just update only the keys under `extra` key with yours settings.


## Reactotron
This project is configured with [Reactotron](https://github.com/infinitered/reactotron), just open the Reactotron GUI before the app is up and running, after start the app Reactotron will identify new connections.
> If Reactotron show an empty timeline after the app is running try run `adb reverse tcp:9090 tcp:9090`, then reload the app.

## API
Start the server in the [`api`](https://github.com/DiegoVictor/omnistack/tree/master/11/api) folder (see its README for more information). If any change in the api's port or host was made remember to update in the `app.json` the `API_URL` property too.
> Also, maybe you need run reverse again but this time to the api: `adb reverse tcp:3333 tcp:3333`

# Start up
```
$ yarn start
```
> This project use Expo, to know how to run in your phone or simulator see [Open the app on your phone or simulator](https://docs.expo.io/versions/latest/workflow/up-and-running/#open-the-app-on-your-phone-or) documentation's section.
