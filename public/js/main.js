/*******************************************
 * 
 * 
 *          These first two functions setup and call the zipcodeapi 
 *          ajax/json stream to get the city and state based upon
 *          the zip code
 * 
 * 
 ********************************************/
var ajax1 = getHTTPObject();
var ajax2 = getHTTPObject();
var ajax3 = getHTTPObject();


function getHTTPObject() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}

function updateCityState(zipValue, city, state) {
    // These next 3 lines are for getting the data from Weather Underground.
    // The apikey is unique to each user and must be updated for your own site
    var apikey = 'd704f31a50bce41f'
    var divId = ''; // This is for if you wish to dynamically set the DIV that the data is written to
    var isJSON = true;

    // If there is a zipcode and the city is blank do a zipcode lookup to get the city and state for that zipcode.
    if (zipValue >= 5 && city == '') {
        if (ajax1) {

            // client key to be able to use the zipcodeapi.com webiste to get date.  Thi is WEB SITE URL specific so it cannot be used on any other website.
            var clientKey = 'js-1bXvnApFrAvwwBfDTkUtvYNh6CulyFDUktpERvCk73lioLE4s66GnNJEQrQAzk0p';

            // Build the URL to request the city and state based upon the zipcode
            var url = "//www.zipcodeapi.com/rest/" + clientKey + "/info.json/" + zipValue + "/radians";

            ajax1.onreadystatechange =
                function() {

                    // This next line checks to make sure that the file has finished being read and that it was read correctly.
                    if (ajax1.readyState == 4 && ajax1.status == 200) {
                        // Parse the JSON returned data into a JavaScript Array
                        var data = JSON.parse(ajax1.responseText);
                        var city = data['city']; // Get the City name and assign it to a variable
                        var state = data['state']; // Get the State name and assign it to a variable

                        // These 5 lines get and write the weather data to the weather table
                        var wuurl = "//api.wunderground.com/api/" + apikey + "/conditions/q/" + state.value + "/" + encodeURIComponent(city.value.trim()) + ".json";
                        var wuurl2 = "//api.wunderground.com/api/" + apikey + "/forecast10day/q/" + state.value + "/" + encodeURIComponent(city.value.trim()) + ".json";
                        readWeatherFile(wuurl, divId, isJSON);
                        readWeatherFile(wuurl2, divId, isJSON);
                    }
                }
            ajax1.open("GET", url, true);
            ajax1.send();
        }
    } else {
        // These 5 lines get and write the weather data to the weather table
        // Build the 2 URL's needed to get all the data from Weather Underground
        var wuurl = "//api.wunderground.com/api/" + apikey + "/conditions/q/" + state + "/" + encodeURIComponent(city.trim()) + ".json";
        var wuurl2 = "//api.wunderground.com/api/" + apikey + "/forecast10day/q/" + state + "/" + encodeURIComponent(city.trim()) + ".json";
        // Call the AJAX calls to read the weather data and write it to the tables.
        readWeatherFileCurrent(wuurl, divId, isJSON);
        readWeatherFileForecast(wuurl2, divId, isJSON);
    }


}


function readWeatherFileCurrent(url, divId, isJSON) {
    /**********************************************
     * This function reads a JSON input file from the server.
     * input:   JSON Data File on the server
     * Processing:  Takes this data and converts it to a JavaScript array.
     *      It then finds the row number selected by the user and displays that data
     * Output:   JavaScript Array of data.
     *************************************************/

    // Create the object to read the file data

    // Setup the object to only run when the file has finished being loaded
    ajax2.onreadystatechange =
        //	This code is not executed immediately. It is call later when the server starts to respond.
        function() {
            // This next line checks to make sure that the file has finished being read and that it was read correctly. It does take 4 loops to get to where this will be true.
            if (ajax2.readyState == 4 && ajax2.status == 200) {

                var responseText = JSON.parse(ajax2.response);
                if (isJSON) {
                    var i = 0,
                        x = 0; // Set counter variables
                    // Set a variable to the 2nd level array object so that you do not need to type all the levels every time.  
                    // Example:  responseText.current_observation.display_location.full vs data.display_location.full
                    var data = responseText.current_observation;

                    // Write the name of the city and state the weather data is for
                    document.getElementById('cityname').innerHTML = data.display_location.full;

                    // Write the current temperature
                    document.getElementById('summary2').innerHTML = data.temp_f + " F"

                }
            }
        }
        // Open the URL and issue a GET.  The false tells the system to run this in synchronized mode.
    ajax2.open("GET", url, true);
    // Execute the request for the URL
    ajax2.send();
}

function readWeatherFileForecast(url, divId, isJSON) {
    /**********************************************
     * This function reads a JSON input file from the server.
     * input:   JSON Data File on the server
     * Processing:  Takes this data and converts it to a JavaScript array.
     *      It then finds the row number selected by the user and displays that data
     * Output:   JavaScript Array of data.
     *************************************************/

    // Create the object to read the file data

    // Setup the object to only run when the file has finished being loaded
    ajax3.onreadystatechange =
        //	This code is not executed immediately. It is call later when the server starts to respond.
        function() {
            // This next line checks to make sure that the file has finished being read and that it was read correctly. It does take 4 loops to get to where this will be true.
            if (ajax3.readyState == 4 && ajax3.status == 200) {

                var responseText = JSON.parse(ajax3.response);
                if (isJSON) {
                    var i = 0,
                        x = 0; // Set counter variables

                    // Set the data variable to be the forecastday array elements.  This is a 4th level deep array.  This is so you do not have to always type the 4 elements first.
                    // example:  responseText.forecast.simpleforecast.forecastday[0]['date'] vs data[0]['date']
                    var data = responseText.forecast.simpleforecast.forecastday;

                    //  Loop through the new array object and create the HTML ID names based upon the index of the array and then populate the HTML data.
                    //  'day'+ index will be day0, day1, etc through day9 for the ID names
                    // data[index]['date'] is the short weekday name that will be written
                    for (index in data) {
                        document.getElementById('day' + index).innerHTML = data[index]['date']['weekday_short'];

                        // This gets and write the forecast high temperature to the table
                        document.getElementById('day' + index + 'temp').innerHTML = data[index]['high']['fahrenheit'];

                        // This gets and writes the forecast low temperature to the table
                        document.getElementById('day' + index + 'lowtemp').innerHTML = data[index]['low']['fahrenheit'];
                    }

                    // This is today forecast high temp
                    document.getElementById('hightemp').innerHTML = data['0']['high']['fahrenheit'] + " F";

                    // This is today forecast low temp
                    document.getElementById('lowtemp').innerHTML = data['0']['low']['fahrenheit'] + " F";

                    // Chance of precipitation forecast for the day
                    document.getElementById('chancepercperc').innerHTML = data['0']['pop'];

                    // Max wind speed recorded for the day so far
                    document.getElementById('maxwindspeed').innerHTML = data['0']['maxwind']['mph'] + " mph";


                }
            }
        }
        // Open the URL and issue a GET.  The false tells the system to run this in synchronized mode.
    ajax3.open("GET", url, true);
    // Execute the request for the URL
    ajax3.send();
}

function checkUsername() {
    var http = new XMLHttpRequest();
    var str = window.location.pathname;
    var base_url = str.slice(0, str.lastIndexOf("/"));
    var url = "//" + window.location.host + base_url + "/validateUsername";
    var uname = document.getElementById('uname').value;
    var params = '?uname=' + uname;
    var errorMsg = document.getElementById('badUsername');
    http.open("GET", url + params, true);

    http.onreadystatechange = function() { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            $response = http.responseText;
            if ($response == 'true') {
                errorMsg.innerHTML = "Username not available";
            } else { errorMsg.innerHTML = ""; }
        }
    }
    http.send();
}

function checkLoginUsername() {
    var http = new XMLHttpRequest();
    var str = window.location.pathname;
    var base_url = str.slice(0, str.lastIndexOf("/"));
    var url = "//" + window.location.host + base_url + "/validateUsername";
    var uname = document.getElementById('username').value;
    var params = '?uname=' + uname;
    var errorMsg = document.getElementById('badUsername');
    http.open("GET", url + params, true);

    http.onreadystatechange = function() { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            $response = http.responseText;
            if ($response == 'true') {
                errorMsg.innerHTML = "Username not registered";
            } else { errorMsg.innerHTML = ""; }
        }
    }
    http.send();
}

function checkEmail() {
    var http = new XMLHttpRequest();
    var str = window.location.pathname;
    var base_url = str.slice(0, str.lastIndexOf("/"));
    var url = "//" + window.location.host + base_url + "/validateEmail";
    var eMail = document.getElementById('email').value;
    var badEmail = document.getElementById('badEmail');
    var params = '?email=' + eMail;
    http.open("GET", url + params, true);

    http.onreadystatechange = function() { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            $response = http.responseText;
            if ($response == 'true') {
                badEmail.innerHTML = "E-Mail address already registered";
            } else {
                badEmail.innerHTML = "";
            }
        }
    }
    http.send();
}

function openSignup() {
    var str = window.location.pathname;
    var base_url = str.slice(0, str.lastIndexOf("/"));
    window.location = "//" + window.location.host + base_url + "/signup";

}