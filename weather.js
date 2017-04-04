/* 
 * Author:  blaselinux
 * Version: 1.0
 * Date:    2017.03.22.
 */

var lat, lon, fok, felho, varos, ido, url, szel, city, orszag, sunRise, sunSet, ikon;
var appId = "912c6f6e2e638690b78d8ed08891d55a";
var kelvin = 272;
var isItCelsius = true;
var weatherData = {};

function timeSet(unixTime){
    var humanTime = new Date(unixTime * 1000);
     var hours = humanTime.getHours();
     if (hours < 10){
         hours = "0" + hours;
     }
     // Minutes part from the timestamp
     var minutes = "0" + humanTime.getMinutes();
     // Seconds part from the timestamp
     var seconds = "0" + humanTime.getSeconds();
    // Will display time in 10:30:23 format
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

function flicker() {
    var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?&format=json";
    $.getJSON( flickerAPI, {tags: ido,tagmode: "any",format: "json"}).done(function( data ) {
        $.each( data.items, function( i, item ) {
            var urlString = item.media.m;
            $("#image").html("<img src=\"" + urlString + "\">");
            if ( i === 0 ) {
                return false;
            }
        });
    });
}

function display(mertekEgyseg) {
    $("#degree").html(fok + "&nbsp;" + mertekEgyseg);
    $("#ikon").html("<img src=\"" + ikon + "\">");
    $("#ido").html(ido);
    $("#varos-ikon").html("<svg class=\"icon-location\"><use xlink:href=\"#icon-location\"></use></svg>");
    $("#varos").html(varos + ", " + orszag);
    flicker();
}

$(document).ready(function(){
    $.getJSON("http://ip-api.com/json", function(b) {
        city = b.city;
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + appId;
            $.getJSON(url, function(t) {
                if (t.cod !== "200") {
                    url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + appId;
                }
            });
            $.getJSON(url, function(a) {
                fok = Math.round(a.main.temp - kelvin);
                felho = a.clouds.all;
                varos = a.name;
                orszag = a.sys.country;
                ido = a.weather[0].description;
                szel = a.wind.speed;
                sunRise = timeSet(a.sys.sunrise);
                sunSet = timeSet(a.sys.sunset);
                ikon = "http://openweathermap.org/img/w/" + a.weather[0].icon + ".png";
                mertekEgyseg = "&#8451";
                display(mertekEgyseg);
            });
        });
    }
});

$(document).ready(function(){
    $("#valtas").on("click",function (){
        if (isItCelsius === true) {
            fok = Math.round(fok * 9 / 5 + 32);
            mertekEgyseg = "&#8457;";
            display(mertekEgyseg);
            isItCelsius = false;
        } else {
            fok = Math.round((fok -32) * 5 / 9);
            mertekEgyseg = "&#8451";
            display(mertekEgyseg);
            isItCelsius = true;
        }
    });
 });
