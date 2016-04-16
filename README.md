
# React-redux-socketio-intl-chat

> this is a fork from [react-redux-socketio-chat](https://github.com/raineroviir/react-redux-socketio-chat)
>
> I am learning react/redux and as an exercise I have added i18n using react-intl. 
> I have removed the login page, externalized the css, changed the chat input to a text area and added a markdown renderer.
> I have also removed bootstrap. 

## Use Guide (taken from the original source)

First off, clone the repository and then `cd react-redux-socketio-intl-chat`and `npm install`

You can create channels with the + sign on the nav bar on the left.
If you click on a user's name to send him a private message (opens a private channel)

### Setting up MongoDB

Note: You need MongoDB set up and running to run the code locally. [Installation instructions](https://docs.mongodb.org/manual/installation/)

Once you've installed MongoDB start up the MongoDB server in a new terminal with the following commands:

```
mkdir db
mongod --dbpath=./db --smallfiles
```

Then open a new terminal and type in `mongo` and type in `use chat_dev`
This is your database interface.  You can query the database for records for example: `db.stats()`.

Now that you've done all that, you can go go ahead and code away!

### Development

```
npm run dev
```
And then point your browser to `localhost:3000`

Note:
This program comes with [redux-dev tools](https://github.com/gaearon/redux-devtools)
* To hide the dev tool panel press ctrl+h
* To change position press ctrl+m

### Production

```
npm run build
npm start
```
And then point your browser to `localhost:3000`

