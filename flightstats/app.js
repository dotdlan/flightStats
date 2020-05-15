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
      fastestPlane(openSkyDB);
    },
    error => {
      console.log(error);
    }
  ); //end of ajax
}); //end of DOM load

const buildOpenSkyDB = apidata => {
  for (const item of apidata.states) {
    openSkyDB.push(item);
  }
  console.log(openSkyDB);
};

const calculateflights = apidata => {
  let numberOfFlights = 0;
  for (const state of apidata) {
    numberOfFlights += 1;
  }
  $counterDiv = $("<div>")
    .html(`<p>Current flights in-air</p><p>${numberOfFlights}</p>`)
    .addClass("counter");
  $(".counters").append($counterDiv);
};
const fastestPlane = apidata => {
  let planeSpeed = 0;
  for (const item of apidata) {
    if (item[9] > planeSpeed) {
      planeSpeed = item[9];
    }
  }
  planeSpeed = Math.floor(planeSpeed * 2.24);
  $counterDiv = $("<div>")
    .html(`<p>Fastest Plane by ground speed (MPH)</p><p>${planeSpeed}</p>`)
    .addClass("counter");
  $(".counters").append($counterDiv);
};
