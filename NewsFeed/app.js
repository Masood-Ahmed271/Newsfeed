// Author: MASOOD AHMED

// *************** TASK (1) SERVER starts **********
var express = require('express');

// Setting up the app for use
var app = express();

// For use of cookies
var cookieParser = require("cookie-parser");

// To use cookies technology and json technology
app.use(express.json());
app.use(cookieParser());

// // A middleware to serve the static file from the public diretcory
const path = require("path")

app.use(express.static(path.join(__dirname, "public"), {
	index: "newsfeed.html"
}))

// Monk is a layer that helps in using mongodb database
var monk = require('monk');

// The following line is used to get the database instance 
// Which is running on the localhost at port 27017 and the database name is assignment1
var db = monk('127.0.0.1:27017/assignment1');

// Make db accessible to the router and A middleware to serve the static file from the public diretcory
app.use(function (req, res, next) {
	req.db = db;
	next();
});

// *************** TASK 1 SERVER SIDE ends here *********


// *************** TASK (4). function starts here **********

// A function to create a login page
// returns: login --> a string format html document for further processing

function rendersLoginPageHTML() {
	let login = `<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta http-equiv="X-UA-Compatible" content="IE=edge">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
				
					<!-- Adding the custom made stylesheet -->
					<link type="text/css" rel="stylesheet" href="./stylesheets/style.css">
				
					<title>Login</title>
				</head>
				<body class="loginPage">
					<div class="container">
						<div class="header">
							<!-- Heading to display a message -->
							<h1 id="login-response">You can login here</h1>
						</div>
						<div class="main">
							<!-- A login form with a username input textbox and a password input teextbox and a submit button -->
							<form name="myForm" method="post">
								<div id="textboxes-form">
								<span>
									User Name
									<input class="inputboxes" type="text" placeholder="Email" name="username" id="email">
								</span><br>
								<span>
									Password 
									<input class="inputboxes" type="password" placeholder="Password" name="password" id="password">
								</span><br>
								<input class="myButton" type="button" value="Submit" onclick="login();" />
								</div>`;

	return login;   // returning back th html content

}
// *************** TASK (4). function ends here **********




// *************** TASK (3) function starts here ***********

// A sorting function to sort the comments by latest to old.
// This function sorts things according to our own set parameters.
// In our own set parameters, we are comparing time of the dates and sorting 
// them from latest to oldest
// parameters: item1,item2 --> These are the objects that need to be sorted
// returns: int(1/-1/0)

function sorting(item1, item2) {
	if (item1.time < item2.time) {
		return 1;
	}
	if (item1.time > item2.time) {
		return -1;
	}
	else {
		return 0;
	}
};

// *************** TASK (3) function ends here ***********





// *************** TASK (2) starts here **************

// A function to get first 10 words
// paramters: A string of which you want ten words
// returns: returns first 10 words of the string

function firstTenWords(str) {
	let result = str.split(/\s+/).slice(0, 10).join(" ");
	result += ".....";
	return result.slice(1);
}


// A function to convert everything into JSON format
// Paramters: docs --> The docs found after sorting 
//            pageIndex --> The index of the page the client is looking for
//			  loginStatus --> The login Status of the user according to the cookies
// Returns:   result --> A JSON format object for further processing

function convertJSON(docs, pageIndex, loginStatus) {

	var documentLength = docs.length;   // To count the number of enteries
	// A result variable to send all the databack
	var result = [{ "entryCount": documentLength }, { "loginStatus": loginStatus }]; // adding the enry counts and loginStatus
	var endListNumber = (pageIndex * 5) - 1;  // To find the end of the enteries
	var startListNumber = endListNumber - 4; // From where to start sending data of enteries
	var counterForEntries = 0;  // to keep track of enteries

	//  A loop to get the required data
	// We need atmost 5 entries per page
	while (counterForEntries < 5) {

		if (startListNumber < documentLength) {

			let str = firstTenWords(JSON.stringify(docs[startListNumber]["content"]));  // to get 10 word content
			docs[startListNumber]["content"] = str;   // changing content
			let id = docs[startListNumber]._id;     // getting id of the object
			let headline = docs[startListNumber].headline; // getting the headline to be shown
			let time = new Date(docs[startListNumber].time).toLocaleString();  // getting time of the news
			let comments = docs[startListNumber].comments;  // getting comments array 
			result.push({ "_id": id, "headline": headline, "content": str, "time": time, "comments": comments }); // putting all things back into the array

		}

		startListNumber++;
		counterForEntries++;

	}

	// Returning the result
	return result;
}



// My code
// Creating /retrievenewslist middleware with queries as following: pageIndex=XX&searchString=XX
app.get("/retrievenewslist", (req, res) => {

	// Storing information given by the server in variables
	var pageIndex = req.query.pageIndex;   // having the page index
	var searchString = req.query.searchstring;  // having the searchstring from the searchbox

	//  Making a variable to store the newsList collection
	var db = req.db;
	var col = db.get("newsList");

	// Looking for cookies
	if (req.cookies.userID) {
		var loginStatus = 1;
	}
	else {
		var loginStatus = 0;
	};

	//  Using database to retrieve essential data. // ****** And $options key pair now
	col.aggregate([{ $match: { headline: { $regex: searchString, $options: "i" } } }, { $sort: { time: -1 } }]).then((docs) => {
		// creating a json format response to be send back to client
		let response = convertJSON(docs, pageIndex, loginStatus);
		res.send(response);
	});

});

// *************** Task (2) ends here ***************




// *************** Task (3) starts here *******************

// Creating /displayNewsEntry middleware with queries as following: newsID=XX
app.get('/displayNewsEntry', (req, res) => {

	// Getting news id from queries parameters
	var newsID = req.query.newsID;
	// A variable to setup the blog page
	var blogSection = `<!DOCTYPE html>
						<html lang="en">
	
						<head>
								<meta charset="UTF-8">
								<meta http-equiv="X-UA-Compatible" content="IE=edge">
								<meta name="viewport" content="width=device-width, initial-scale=1.0">
	
								<!-- Adding the custom made stylesheet -->
								<link type="text/css" rel="stylesheet" href="./stylesheets/style.css">`


	//  Making a variable to store the newsList collection
	var db = req.db;
	var col = db.get("newsList"); // a collection of news
	var col2 = db.get("userList"); //. a collection of users

	col.find({ _id: newsID }).then((docs) => {      // processing on the newsID
		var newsID = docs[0]._id;
		let headline = docs[0].headline;
		let time = docs[0].time;
		let content = docs[0].content;
		let commentsArray = docs[0].comments;

		// Adding the header
		blogSection += `<title>${headline}</title>
						</head>
						<body>
							<!-- <div class="blog-page"> -->
							<nav class="blog-page">
								<form action="/newsfeed.html">
									<button class="back-button" type="submit">
										<!-- &#x25c0; -->
										&#8592;
										<!-- &laquo; Previous -->
									</button>
								</form>
								<div class="headline-news">
									<h1>${headline}</h1>
									<p>${new Date(time).toLocaleString()}</p>
								</div>
								<br><br>
							</nav>
							<div class="news-content">
								<p>${content}</p>
							</div>
							<div class="comment-section">
        						<div class="comment-heading">
            						<h4>Comments</h4>
        						</div>
        						<div class="comment-container" id="holding-comments">`;

		// sorting comments according to latest to oldest
		var commentsSorted = commentsArray.sort(sorting);

		// A loop to add comments to the comment section in the html
		for (let i = 0; i < commentsSorted.length; i++) {
			var userID = commentsSorted[i].userID;  // Getting the user who commented 

			col2.find({ _id: userID }).then((docs2) => {         // to find the details of the user who commented such as name, icon, comment
				var userName = docs2[0].name;
				var icon = docs2[0].icon;
				var commentOfUser = commentsSorted[i].comment
				var timeOfComment = commentsSorted[i].time;

				// Adding the comment to the comment section 
				blogSection += `<div class="commentbox">
								<div class="box-top">
									<div class="profile">
										<div class="profile-image">
											<img src="${icon}" alt="image of a person">
										</div>
										<div class="name-time">
											<Strong>${userName}</Strong>
											<span>${new Date(timeOfComment).toLocaleString()}</span>
										</div>
									</div>
								</div>
								<div class="comments">
									<p>${commentOfUser}</p>
								</div>
							</div>`;


				// checking if it was the last comment that needed to be added
				if (i == (commentsSorted.length - 1)) {

					if (req.cookies.userID) {    // checking if the user is logged in or not
						blogSection += `</div>
										</div>
										<div class="post-comment-box">
											<input type="textbox" name="textbox" class="textbox" placeholder="Write a comment...." id="comment-box">
											<button class="textbutton" onclick = "postComment('${newsID}','${commentsSorted[0].time}')">post comment</button>
										</div>
										<script src="./javascripts/script.js"></script>
									</body>
								</html>`;
					}
					else {
						blogSection += `</div>
										</div>
										<div class="post-comment-box">
											<input type="textbox" name="textbox" class="textbox" placeholder="Write a comment...." disabled id="comment-box">
											<a href="/login?newsID=${newsID}"><button class="textbutton">login to comment</button></a>
										</div>
										<script src="./javascripts/script.js"></script>
									</body>
								</html>`;
					}
					// sending back the info to the client
					res.send(blogSection);
				}
			});
		}
	});
});


// Creating /handlePostComment middleware with body containing comment,newsID,timeOfComment,latestCommentOnPage
app.post('/handlePostComment', (req, res) => {
	var commentByUser = req.body.comment;
	var newsIDOfThePage = req.body.newsID;
	var timeOfUsersComment = req.body.timeOfComment;
	// var LatestCommentOnPage = req.body.PostTimeOfLatestComment;  // might not need it 
	var userID = req.cookies.userID

	var db = req.db;
	var col = db.get("newsList");  // database for newslist
	var col2 = db.get("userList");    // database for userlist
	// the object we need to insert back into the database
	var userIDToBeInserted = monk.id(userID);
	// var isoTime = new Date(timeOfUsersComment).toISOString()
	var commentToBeInserted = { "userID": userIDToBeInserted, "time": new Date(timeOfUsersComment), "comment": commentByUser }

	// Adding the comment at the start of the comments array of the respective news item to execute the sorted functionality
	col.update({ _id: newsIDOfThePage }, { $push: { comments: { $each: [commentToBeInserted], $position: 0 } } }).then((docs) => {
		// console.log("Docs after being changed and updated below --> ");
		// console.log(JSON.stringify(docs));
	});

	// Finding the details of the person who commented
	col2.find({ _id: userID }).then((docs2) => {
		let name = docs2[0].name;
		let icon = docs2[0].icon;
		let json = { "name": name, "icon": icon, "time": timeOfUsersComment, "comment": commentByUser };
		// console.log("Done with handlepost comment");
		res.send(json);  // sending the file back to the client
	});
});


// *************** Task (3) ends here *************





// *************** TASK (4) STARTS HERE **************

// Creating /login middleware with queries as following: newsID=XX
app.get('/login', (req, res) => {

	var newsID = req.query.newsID;  // getting the newsID
	var loginHTML = rendersLoginPageHTML();  // creates a login page html
	// A condition for where to link the Go Back button
	if (parseInt(newsID) == 0) {
		loginHTML += `<a href="/newsfeed.html" class="goBack">Go Back</a><br>
					</form>
					</div>
				</div>
				<script src="./javascripts/script.js"></script>
				</body>
				</html>`;
	}
	else if (parseInt(newsID) > 0) {   // can use else
		loginHTML += `<a href="/displayNewsEntry?newsID=${newsID}" class="goBack">Go Back</a><br>
					</form>
					</div>
				</div>
				<script src="./javascripts/script.js"></script>
				</body>
				</html>`;

	}

	res.send(loginHTML);   // sending the response back to the client
});

// Creating /handleLogin middleware with queries as following: username=XX&password=XX
app.get('/handleLogin', (req, res) => {

	var userName = req.query.username;
	var userPassword = req.query.password;

	//  Making a variable to store the newsList collection
	var db = req.db;
	var col = db.get("userList");

	// finding if the username exists or not
	col.find({ name: userName }).then((docs) => {

		var userID = docs[0]._id;
		if (docs[0].password == userPassword) {    // seeing if the credentials match
			res.cookie("userID", userID, { maxAge: 60000000 });  // setting cookie
			res.send("login success");

		}
		else {      // sending a message that the password is incorrect
			res.send("Password is incorrect");
			
		}
	}).catch((err) => {      // If the username is incorrect
		res.send("Username is incorrect");
		
	});

});

// Creating /handleLogout middleware
app.get('/handleLogout', (req, res) => {
	res.clearCookie("userID");
	res.send("logout success")
});

// *************** TASK (4) ends here ******************




// TASK (1) starts **********
// launch the server with port 8081
var server = app.listen(8081, () => {
	let host = server.address().address;
	let port = server.address().port;
	console.log("App listening at http://%s:%s", host, port);
});
// *************** TASK 1 ends here *********
