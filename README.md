gyrosocket
==========

a node.js based express web app which transmits iphone gyroscope and accelerometer data over socket.io


#### usage
***for now, this is just a proof-of-concept***

install npm modules

```
cd /app && npm install
```
start the app

```
node app
```

navigate to `http://localhost:8888` **on your desktop**, a URL for your gyrosocket will be set up (right now only the path `/test`)

assuming your iphone is on the same network, navigate to `http://{YOUR LOCAL IP}:8888/test`

you should see your iphones gyroscope data being emitted to the viewer!