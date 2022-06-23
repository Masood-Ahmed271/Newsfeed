---
Title: Newsfeed
Author: Masood Ahmed
Email: 'masood20@connect.hku.hk' or 'mangimasood2000@gmail.com'
---

# NewsFeed

It is an app that is made using node.js technology especially by using express.js along with javascript, html, and CSS. The purpose of this app to allow the user to view news
and comment on any news after logging in.

____________________________________________________________________________________________________________________________________________________________________

## Things required to run this program

Your should have node, and mongodb installed for you to run the codes.


*Note:* You might need following node dependencies to run the app:
***
*     cookie-parser                  (npm i cookie-parser)
*     express                        (npm install express)
*     express-session                (npm install express-session)
*     monk                           (npm install --save monk)
*     morgan                         (npm i morgan)
*     xml2js                         (npm i xml2js)

*Note:* Also try to follow the same folder structure and if it doesn't work, try running 'npm install' first and retry the commands given below

____________________________________________________________________________________________________________________________________________________________________

## Mongodb Setup

For you to be able to run the app properly by taking data from mongodb, you must need to setup mongodb and add data in it. You might need to delete the 'data' folder and re-create it 
and run it using the command 

____________________________________________________________________________________________________________________________________________________________________

## To run the Code for the NewsFeed:

You would have to open three terminals. In two terminals run the mongodb and mongo server by looking at the commands below. In the terminal where you ran the command mongo (in mac {do accordingly in windows})
run the following commands:

```terminal/cmd
db.userList.insert({'name':'Amy', 'password':'123456', 'icon':'images/amy.jpg'})
```

This will create a collection in mongodb called userList. You can create multiple such users

The following command is used to create a mongodb collection called newsList. Again, you can multiple but do remember to change the objectID because it might be unqiue and different for different users.
```terminal/cmd
db.newsList.insert({'headline':'Jason Day signs with Bridgestone Golf', 'content':' Twelve-time
PGA TOUR winner Jason Day has signed with Bridgestone Golf to use its golf ball.', 'time':new
Date(), 'comments':[{ 'userID': ObjectId("507f1f77bcf86cd799439011"),
'time':ISODate("2022-03-02T22:31:55Z"), 'comment': 'Fantistic!'}]})
```

*Note:* You can have an example of database data from Database.rtf file.


*Commands For MacOS!!*

Terminal 1 to run mongo server:

```terminal/cmd
mongod --dbpath YourPath/test/data
```

Terminal 2 to open mongo and add data:

```terminal/cmd
mongo
```

*Commands For Windows!!*

Terminal 1 to run mongo server:

```terminal/cmd
./bin/mongod --dbpath YourPath/test/data
```

Terminal 2 open mongo and add data:

```terminal/cmd
./bin/mongo
```

____________________________________________________________________________________________________________________________________________________________________


#### To Finally Run the app.

Terminal 3:

```terminal/cmd
node app.js
```


____________________________________________________________________________________________________________________________________________________________________


## You can view your app on the browser on the following url:

http://127.0.0.1:8081/ 


____________________________________________________________________________________________________________________________________________________________________

## For Reference if needed:

To create an express app you can run the following command by going into your desired directory.

```terminal/cmd
cd test
npx express-generator
```