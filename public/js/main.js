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
    if (ajax1) {
        // var zipValue = document.getElementById("zipcode").value;
        if (zipValue >= 5 && city == '') {
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
                        writeLocalWeather();
                    } else {
                        // document.getElementById('serverState').innerHTML += "Ready State: " + ajax1.readyState + "  Status: " + ajax1.status + "<BR>";
                    }
                }
            ajax1.open("GET", url, true);
            ajax1.send();
        } else {
            // These 6 lines get and write the weather data to the weather table
            var wuurl = "//api.wunderground.com/api/" + apikey + "/conditions/q/" + state + "/" + encodeURIComponent(city.trim()) + ".json";
            var wuurl2 = "//api.wunderground.com/api/" + apikey + "/forecast10day/q/" + state + "/" + encodeURIComponent(city.trim()) + ".json";
            localStorage.clear();
            readWeatherFile(wuurl, divId, isJSON);
            readWeatherFile(wuurl2, divId, isJSON);
            writeLocalWeather();
        }


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
                writeDatatolocalStorage(ajax2.responseText, divId, isJSON);

            } else { // this will show us what is happening before the data arrives
                // document.getElementById('serverState').innerHTML += "WU Ready State: " + ajax2.readyState + "  Status: " + ajax2.status + "<br>";
            }
        }
    ajax2.open("GET", url, false);
    ajax2.send();
}


function writeDatatolocalStorage(response, divId, isJSON) {
    /**********************************************
     * This function takes the file that was read and exicutes what we want done with it
     * input:   JSON Data File, 
     *       The DIV ID where the out needs to be written, 
     *       is this file a JSON file
     * Processing:  Takes this data and converts it to a JavaScript array.
     *      It then finds the row number selected by the user and displays that data
     * Output:   JavaScript Array of data.
     *************************************************/
    var responseText = (isJSON) ? JSON.parse(response) : response;

    //	Now we will take the text and do something with it
    if (isJSON) {
        var i = 0; // Set counter variable
        var x = 0;
        var test = responseText.current_observation;
        if (test === undefined) {
            var data = responseText.forecast.simpleforecast.forecastday;

            for (index in data) {
                localStorage.setItem('day' + index, data[index]['date']['weekday_short']);
                localStorage.setItem('day' + index + 'high', data[index]['high']['fahrenheit']);
                localStorage.setItem('day' + index + 'low', data[index]['low']['fahrenheit']);
            }
            localStorage.setItem('todayhigh', data['0']['high']['fahrenheit']);
            localStorage.setItem('todaylow', data['0']['low']['fahrenheit']);
            localStorage.setItem('percip', data['0']['pop']);
            localStorage.setItem('maxwind', data['0']['maxwind']['mph'] + " mph");
            // writeLocalWeather();
        } else {
            var data = responseText.current_observation;
            var location = data.display_location;
            var names = Object.keys(data);
            var locnames = Object.keys(location);

            // Loop through the variables in the array and create the output
            for (i; i < names.length; i++) {
                localStorage.setItem(names[i], data[names[i]]);
            }
            for (x; x < locnames.length; x++) {
                localStorage.setItem(locnames[x], location[locnames[x]]);
            }
        }
    }
}

function writeLocalWeather() {
    storeArry = {};
    for (i = 0; i < localStorage.length; i++) {
        var a = localStorage.key(i);
        var b = localStorage.getItem(a);
        storeArry[a] = b;
    }

    document.getElementById('cityname').innerHTML = storeArry.full;
    document.getElementById('maxwindspeed').innerHTML = storeArry.maxwind;
    document.getElementById('summary2').innerHTML = storeArry.temp_f + " F";
    document.getElementById('hightemp').innerHTML = storeArry.todayhigh + " F";
    document.getElementById('lowtemp').innerHTML = storeArry.todaylow + " F";
    document.getElementById('chancepercperc').innerHTML = storeArry.percip + " %";
    document.getElementById('day0').innerHTML = storeArry.day0;
    document.getElementById('day1').innerHTML = storeArry.day1;
    document.getElementById('day2').innerHTML = storeArry.day2;
    document.getElementById('day3').innerHTML = storeArry.day3;
    document.getElementById('day4').innerHTML = storeArry.day4;
    document.getElementById('day5').innerHTML = storeArry.day5;
    document.getElementById('day6').innerHTML = storeArry.day6;
    document.getElementById('day7').innerHTML = storeArry.day7;
    document.getElementById('day8').innerHTML = storeArry.day8;
    document.getElementById('day9').innerHTML = storeArry.day9;
    document.getElementById('day0temp').innerHTML = storeArry.day0high;
    document.getElementById('day1temp').innerHTML = storeArry.day1high;
    document.getElementById('day2temp').innerHTML = storeArry.day2high;
    document.getElementById('day3temp').innerHTML = storeArry.day3high;
    document.getElementById('day4temp').innerHTML = storeArry.day4high;
    document.getElementById('day5temp').innerHTML = storeArry.day5high;
    document.getElementById('day6temp').innerHTML = storeArry.day6high;
    document.getElementById('day7temp').innerHTML = storeArry.day7high;
    document.getElementById('day8temp').innerHTML = storeArry.day8high;
    document.getElementById('day9temp').innerHTML = storeArry.day9high;
    if (storeArry.windchill_string !== 'NA') {
        document.getElementById('windchill').classList.remove('hiddenitems');
        document.getElementById('windchillnow').classList.remove('hiddenitems');
        document.getElementById('windchillnow').innerHTML = storeArry.windchill_f;
    } else {
        document.getElementById('windchill').classList.add('hiddenitems');
        document.getElementById('windchillnow').classList.add('hiddenitems');
    }
    var show = document.querySelector("#forecast");
    show.style.display = "none";
    show.style.display = "flex";

}