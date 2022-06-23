// Author: MASOOD AHMED

// ************** TASK (2) STARTS HERE ***************

// A function to get the required news according to the pageindex
// parameters: pageindex --> the index number of the page for which the results are to be loaded

function loadNewsList(pageindex) {

    // Getting value from the search box
    var searchString = document.getElementById("searchBox").value;

    // Checking if string is defined or not
    if (searchString == null || searchString == undefined || searchString == "") {
        searchString = "";
    }
    // Declaring neessary variables
    var news = document.getElementById("news");  // getting the divison where news has to be presented
    var pageindices = document.getElementById("pageindex"); // getting the division where the pageindices are to be posted.

    // creating xmlhtpresponse object for communicating with client and server
    var xhttp = new XMLHttpRequest();

    // Sending requests to the server
    xhttp.open("GET", "retrievenewslist?pageIndex=" + pageindex + "&searchstring=" + searchString, true);
    xhttp.send();

    // To process the data recieved from the client side
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            var response = JSON.parse(xhttp.responseText); // parsing the data sent from the server
            var totalNumberOfEntries = response[0]["entryCount"];
            var loginStatus = response[1]["loginStatus"];

            // Part (a) of Task 2 script side
            if (loginStatus == 0) {
                let login = document.getElementById("login-div");
                login.innerHTML = "Log in";
                login.setAttribute("href", "/login?newsID=0");
            }
            else if (loginStatus == 1) {
                let login = document.getElementById("login-div");
                login.innerHTML = "Log out";
                login.setAttribute('onclick', 'logout()');    // event handler added to deal with logout function.
            }

            // Part (b) of TASK 2 script side
            var divHTML = ""; // a divison to fill news division in newsfeed.html 

            for (let j = 2; j < response.length; j++) {  // looping from 2 ownwards because indeces 0 and 1 are entryCount and loginStatus
                let headline = response[j]["headline"];
                let content = response[j]["content"];
                let id = response[j]["_id"];
                let time = response[j]["time"];

                divHTML += `<div id="news-div">
                                <h1><a href="/displayNewsEntry?newsID=${id}" id="news-link">${headline}</a></h1>
                                <br>
                                <h4>${time}</h6>
                                <br>
                                <p>${content}</p>
                            </div>
                            <br>`
            }
            news.innerHTML = divHTML;   // Finally adding the news html to the news divison

            // Part (c) of TASK 2 script side
            var pages = Math.ceil(totalNumberOfEntries / 5); // To get the number of pages. We are using 5 because we need 5 enteries per page
            var indices = "";  // to add indices back to the indices divison
            for (let i = 1; i <= pages; i++) {   // starting from 1 bevause we want to show 1 2 3 ... on the indices not 1 2 3 ...
                if (i === pageindex) {
                    // for highlighting the current page index
                    indices += `<a style="color:blue; text-decoration: none;" href="javascript:loadNewsList(${i})">${i}</a>&nbsp&nbsp`;
                }
                else {
                    indices += `<a style="color:black; text-decoration: none;" href="javascript:loadNewsList(${i})">${i}</a>&nbsp&nbsp`
                }
            }
            pageindices.innerHTML = indices;  // updating the html of newsfeed.html
        };
    };
}

// ************** TASK (2) ENDS HERE ***************




// *************** TASK (3) STARTS HERE ***************

// A function to handle the posting of comment by the user
// parameters: newsID --> ID of the news where you want to post the comment
//             postTime --> Time of the latest comment

function postComment(newsID, postTime) {

    // Retrieving comment from the comment box
    var commentText = document.getElementById("comment-box").value;

    // Condition for sending an XHTTPREQUEST or not
    if (commentText == null || commentText == "" || commentText == undefined) {
        alert("No comment has been entered");
        return;
    }
    else {

        let currentTime = new Date();  // Finding time of the comment done
        // creating a JSON String that is to be sent to the server for processing
        var json = { "comment": commentText, "newsID": newsID, "timeOfComment": currentTime, "PostTimeOfLatestComment": new Date(postTime).toLocaleString() };

        // Getting the innerhtml of the section where we have to modify the comments
        var commentSection = document.getElementById("holding-comments").innerHTML;

        xhttp = new XMLHttpRequest();  //Creating an XMLHttpRequest

        // Sending a post request

        console.log("Sent request for posting comment");
        xhttp.open('POST', "/handlePostComment", true);   // a POST request
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(json));

        // Processing on response
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var response = JSON.parse(xhttp.responseText);  // response from the server
                // the comment that is to be added
                var htmlToBeAdded = `<div class="commentbox">
                                    <div class="box-top">
                                        <div class="profile">
                                            <div class="profile-image">
                                                <img src="${response.icon}" alt="image of a person">
                                            </div>
                                            <div class="name-time">
                                                <Strong>${response.name}</Strong>
                                                <span>${new Date(response.time).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="comments">
                                        <p>${response.comment}</p>
                                    </div>
                                </div>`;
                // Adding at the top of all comments as it is the latest
                htmlToBeAdded += commentSection
                document.getElementById("holding-comments").innerHTML = htmlToBeAdded;  // changing HTML

                // clearing commentbox
                document.getElementById("comment-box").value = "";

            }
        }
    }
}

// *************** TASK (3) END HERE ***************




// *************** TASK (4)  STARTS HERE ************

// A function that oversees logging in of the user

function login() {

    // Getting username and password entered by the user
    var userNameText = document.getElementById("email").value;
    var userPassword = document.getElementById("password").value;

    // setting a xmlhttp object
    var xhttp = new XMLHttpRequest();

    // checking if the any of the textbox are empty or null
    if (userNameText == null || userNameText == undefined || userNameText == "" || userPassword == null || userPassword == undefined || userPassword == "") {
        alert("Please enter username and password");
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        return;
    }
    else {
        // Sending requests to the server
        xhttp.open("GET", "/handleLogin?username=" + userNameText + "&password=" + userPassword, true);
        xhttp.send();
    }

    // acting according to the response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            var responseFromServer = xhttp.responseText;  // response from the server

            if (responseFromServer == "login success") {
                document.getElementById("login-response").innerHTML = "You have successfully logged in";
                document.getElementById("textboxes-form").remove();  // removing the form from display
            }
            else if (responseFromServer == "Password is incorrect") {

                document.getElementById("login-response").innerHTML = "Password is incorrect";
                // making the boxes empty
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
            }
            else if (responseFromServer == "Username is incorrect") {

                document.getElementById("login-response").innerHTML = "Username is incorrect";
                // making the boxes empty
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
            }
        }
    }
}

// A function to logout the person 
function logout() {

    var xhttp = new XMLHttpRequest();

    // Sending requests to the server
    xhttp.open("GET", "/handleLogout", true);
    xhttp.send();

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // on recieving the request
            if (xhttp.responseText == "logout success") {
                let login = document.getElementById("login-div")
                login.innerHTML = "Log in";
                login.setAttribute("href", "/login?newsID=0");
            }
        }
    }
}

// *************** TASK (4)  ENDS HERE ************