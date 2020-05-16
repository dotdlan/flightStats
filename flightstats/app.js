console.log("it works");
const openSkyDB = [];
$(() => {
  $.ajax({
    //accessing this url each time costs .5second to 1.5seconds,
    //this will be exponetially bad
    //store the result once and resuse it to speed it up.
    url: "" //"https://opensky-network.org/api/states/all"
  }).then(
    data => {
      // buildOpenSkyDB(data);
      // calculateflights(openSkyDB);
      // fastestPlane(openSkyDB);
      // highestPlane(openSkyDB);
    },
    error => {
      console.log(error);
    }
  ); //end of ajax
  $(".btn").on("click", event => {
    let $value = $("input").val();
    console.log($value);
  });
}); //end of DOM load

//let's make a local copy of the db so that our requests don't exponetially increase load time.
const buildOpenSkyDB = apidata => {
  for (const item of apidata.states) {
    openSkyDB.push(item);
  }
};

//let's calculate the total number of flights in the air.
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

//let's figure out which is the fastest
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

//let's figure out which is the highest
const highestPlane = apidata => {
  let highPlane = 0;
  for (const item of apidata) {
    if (item[7] > highPlane) {
      highPlane = item[7];
    }
  }
  highPlane = Math.floor(highPlane * 3.281);
  $counterDiv = $("<div>")
    .html(`<p>Highest plane in the sky (feet)</p><p>${highPlane}</p>`)
    .addClass("counter");
  $(".counters").append($counterDiv);
};
