console.log("it works");
const openSkyDB = [];
$(() => {
  $.ajax({
    //accessing this url each time costs .5second to 1.5seconds,
    //this will be exponetially bad
    //store the result once and resuse it to speed it up.
    url: "https://opensky-network.org/api/states/all"
  }).then(
    data => {
      buildOpenSkyDB(data);
      calculateflights(openSkyDB);
    },
    error => {
      console.log(error);
    }
  ); //end of ajax
}); //end of DOM load

let numberOfFlights = 0;
const calculateflights = apidata => {
  for (const state of apidata) {
    numberOfFlights += 1;
  }
  $counterDiv = $("<div>")
    .html(`<p>Flights in-air right now</p><p>${numberOfFlights}</p>`)
    .addClass("counter");
  $(".counters").append($counterDiv);
};

const buildOpenSkyDB = apidata => {
  for (const item in apidata.states) openSkyDB.push(apidata.states[item]);
};
