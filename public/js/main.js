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
    var divId = '';
    var isJSON = true;
    // var zipValue = document.getElementById("zipcode").value;
    if (zipValue >= 5 && city == '') {
        if (ajax1) {

            // client key to be able to use the zipcodeapi.com webiste to get date
            var clientKey = 'js-1bXvnApFrAvwwBfDTkUtvYNh6CulyFDUktpERvCk73lioLE4s66GnNJEQrQAzk0p';

            var url = "//www.zipcodeapi.com/rest/" + clientKey + "/info.json/" + zipValue + "/radians";
            ajax1.onreadystatechange =
                function() {

                    // This next line checks to make sure that the file has finished being read and that it was read correctly.
                    if (ajax1.readyState == 4 && ajax1.status == 200) {
                        // document.getElementById('serverState').innerHTML += "Ready State: " + ajax1.readyState + "  Status: " + ajax1.status + " start<BR>";
                        var data = JSON.parse(ajax1.responseText);
                        var city = data['city']
                        var state = data['state'];

                        // These 6 lines get and write the weather data to the weather table
                        var wuurl = "//api.wunderground.com/api/" + apikey + "/conditions/q/" + state.value + "/" + encodeURIComponent(city.value.trim()) + ".json";
                        var wuurl2 = "//api.wunderground.com/api/" + apikey + "/forecast10day/q/" + state.value + "/" + encodeURIComponent(city.value.trim()) + ".json";
                        localStorage.clear();
                        readWeatherFile(wuurl, divId, isJSON);
                        readWeatherFile(wuurl2, divId, isJSON);

                    } else {
                        // document.getElementById('serverState').innerHTML += "Ready State: " + ajax1.readyState + "  Status: " + ajax1.status + "<BR>";
                    }
                }
            ajax1.open("GET", url, true);
            ajax1.send();
        }
    } else {
        // These 6 lines get and write the weather data to the weather table
        var wuurl = "//api.wunderground.com/api/" + apikey + "/conditions/q/" + state + "/" + encodeURIComponent(city.trim()) + ".json";
        var wuurl2 = "//api.wunderground.com/api/" + apikey + "/forecast10day/q/" + state + "/" + encodeURIComponent(city.trim()) + ".json";
        localStorage.clear();
        readWeatherFile(wuurl, divId, isJSON);
        readWeatherFile(wuurl2, divId, isJSON);
    }


}


function readWeatherFile(url, divId, isJSON) {
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
        //	This code is not executed immedidaitely. It is call later when the server starts to respond.
        function() {
            // This next line checks to make sure that the file has finished being read and that it was read correctly.
            if (ajax2.readyState == 4 && ajax2.status == 200) {
                // document.getElementById('serverState').innerHTML += "WU Ready State 4: " + ajax2.readyState + "  Status: " + ajax2.status + "<br>";

                var responseText = JSON.parse(ajax2.response);
                if (isJSON) {
                    var i = 0; // Set counter variable
                    var x = 0;
                    var test = responseText.current_observation;
                    if (test === undefined) {
                        var data = responseText.forecast.simpleforecast.forecastday;

                        for (index in data) {
                            document.getElementById('day' + index).innerHTML = data[index]['date']['weekday_short'];
                            document.getElementById('day' + index + 'temp').innerHTML = data[index]['high']['fahrenheit'];
                            document.getElementById('day' + index + 'lowtemp').innerHTML = data[index]['low']['fahrenheit'];
                        }
                        document.getElementById('hightemp').innerHTML = data['0']['high']['fahrenheit'] + " F";
                        document.getElementById('lowtemp').innerHTML = data['0']['low']['fahrenheit'] + " F";
                        document.getElementById('chancepercperc').innerHTML = data['0']['pop'];
                        document.getElementById('maxwindspeed').innerHTML = data['0']['maxwind']['mph'] + " mph";

                    } else {
                        var data = responseText.current_observation;
                        document.getElementById('cityname').innerHTML = data.display_location.full;
                        document.getElementById('summary2').innerHTML = data.temp_f + " F"

                    }
                }

            } else { // this will show us what is happening before the data arrives
                // document.getElementById('serverState').innerHTML += "WU Ready State: " + ajax2.readyState + "  Status: " + ajax2.status + "<br>";
            }
        }
    ajax2.open("GET", url, false);
    ajax2.send();
}


function checkUsername() {
    var http = new XMLHttpRequest();
    var str = window.location.pathname;
    var base_url = str.slice(0, str.lastIndexOf("/"));
    var url = "//" + window.location.host + base_url + "/validateUsername";
    var uname = document.getElementById('uname').value;
    var params = '?uname=' + uname;
    var errorMsg = document.getElementById('badUsername')
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