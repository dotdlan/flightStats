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
      buildCountrySelector(openSkyDB);
      calculateflights(openSkyDB);
      fastestPlane(openSkyDB);
      highestPlane(openSkyDB);
      generateFlightTracker(openSkyDB);
    },
    error => {
      console.log(error);
    }
  ); //end of ajax
  $(".btn").on("click", event => {
    let $value = $("select").val();
    calculateflights(openSkyDB, $value);
    fastestPlane(openSkyDB, $value);
    highestPlane(openSkyDB, $value);
  });
  $(".track-flight").on("click", event => {
    if ($(".track-flight").hasClass("selected")) {
    } else {
      $(".flight-stats")
        .css("background-color", "lightgrey")
        .removeClass("selected");
      $(".track-flight")
        .css("background-color", "lightblue")
        .addClass("selected");
      $(".stat-container").toggle();
      $(".track-container").toggle();
    }
  });
  $(".flight-stats").on("click", event => {
    if ($(".flight-stats").hasClass("selected")) {
    } else {
      $(".flight-stats")
        .css("background-color", "lightblue")
        .addClass("selected");
      $(".track-flight")
        .css("background-color", "lightgrey")
        .removeClass("selected");
      $(".stat-container").toggle();
      $(".track-container").toggle();
    }
  });
}); //end of DOM load

//let's make a local copy of the db so that our requests don't exponetially increase load time.
const buildOpenSkyDB = apidata => {
  for (const item of apidata.states) {
    openSkyDB.push(item);
  }
};

//let's populate our country selector
const buildCountrySelector = apidata => {
  const countries = [];
  for (const item of apidata)
    if (countries.includes(item[2])) {
    } else {
      countries.push(item[2]);
    }
  countries.sort();
  for (const country of countries) {
    $countries = $("#World");
    $newCountry = $("<option>")
      .attr("value", `${country}`)
      .text(country);
    $countries.append($newCountry);
  }
};

//let's calculate the total number of flights in the air.
const calculateflights = (apidata, lookUpCountry) => {
  let numberOfFlights = 0;
  for (const state of apidata) {
    if (lookUpCountry === undefined || lookUpCountry === "World") {
      numberOfFlights += 1;
    } else if (state[2] === lookUpCountry) {
      numberOfFlights += 1;
    }
  }
  let $worldMap = getMap("World");
  $counterDiv = $("<div>")
    .html(`<p>Flights in-air</p><p>${numberOfFlights}</p>`)
    .addClass("flight-counter");
  if (lookUpCountry) {
    $(".flight-counter").replaceWith($counterDiv);
  } else {
    $(".counters").append($counterDiv);
  }
  $(".flight-counter").append($worldMap);
};

//let's figure out which is the fastest
const fastestPlane = (apidata, lookUpCountry) => {
  let planeSpeed = 0;
  let record = [];
  for (const item of apidata) {
    let i = 0;
    if (lookUpCountry === undefined || lookUpCountry === "World") {
      if (item[9] > planeSpeed) {
        planeSpeed = item[9];
        record = item;
      }
    } else if (item[2] === lookUpCountry) {
      if (item[9] > planeSpeed) {
        planeSpeed = item[9];
        record = item;
      }
    }
  }
  let $map = getMap(record);
  //let's convert from knots to mph
  planeSpeed = Math.floor(planeSpeed * 2.24);
  $counterDiv = $("<div>")
    .html(`<p>Fastest Plane</p><p>${record[1]}: ${planeSpeed}MPH</p>`)
    .addClass("speed-counter");
  if (lookUpCountry) {
    $(".speed-counter").replaceWith($counterDiv.append($map));
  } else {
    $(".counters").append($counterDiv.append($map));
  }
};

//let's figure out which is the highest
const highestPlane = (apidata, lookUpCountry) => {
  let highPlane = 0;
  let record = [];
  for (const item of apidata) {
    if (lookUpCountry === undefined || lookUpCountry === "World") {
      if (item[7] > highPlane) {
        highPlane = item[7];
        record = item;
      }
    } else if (item[2] === lookUpCountry) {
      if (item[7] > highPlane) {
        highPlane = item[7];
        record = item;
      }
    }
  }
  let $map = getMap(record);
  //let's convert this from meters to feet
  highPlane = Math.floor(highPlane * 3.281);
  $counterDiv = $("<div>")
    .html(
      `<p>Highest plane</p><p>${record[1] || "Unknown"}: ${highPlane}ft</p>`
    )
    .addClass("height-counter");
  if (lookUpCountry) {
    $(".height-counter").replaceWith($counterDiv.append($map));
  } else {
    $(".counters").append($counterDiv.append($map));
  }
};

//Let's make a map image. Pass it an array from the openSkyDB and it'll find the coordinates
const getMap = mapRecord => {
  //store the parts of our map fetching url that don't change between requets
  const staticKey = "AIzaSyACJV6r7RNNeasGt_vdvf3lhFC71dZFn04";
  const staticURL =
    "https://maps.googleapis.com/maps/api/staticmap?maptype=hybrid&size=300x300";
  if (mapRecord === "World") {
    $map = $("<img>")
      .attr("src", `${staticURL}&center=Bermuda&zoom=1&key=${staticKey}`)
      .addClass("map");
  } else {
    $map = $("<img>")
      .addClass("map")
      .attr(
        "src",
        `${staticURL}&zoom=5&markers=color:blue|${mapRecord[6]},${mapRecord[5]}&key=${staticKey}`
      );
  }
  return $map;
};
//let's generate a second hidden page within our /index.html that will be
//revealed with .toggle() when the user clicks "Track Flight"
const generateFlightTracker = apidata => {
  const $trackContainer = $(".track-container");
  const $trackAFlight = $("<div>").addClass("track-a-flight");
  const $trackForm = $("<form>");
  const $trackInput = $("<input>").attr("type", "text");
  const $trackSubmit = $("<div>")
    .attr("id", "track-submit")
    .text("Submit");
  const $worldMap = getMap("World");
  $trackInput.attr("placeholder", "Flight Number:'AAL1234'");
  $trackInput.attr("id", "tracker-form");
  $trackContainer.append($trackAFlight);
  $trackAFlight.append($trackForm);
  $trackAFlight.append($worldMap);
  $trackForm.append($trackInput).append($trackSubmit);
  //let's make a click handler for our fligt tracker submit button
  $("#track-submit").on("click", event => {
    //would like to make this more durable like
    //if user inputs something that errors/doesn't return anything
    let $flightNumber = $("#tracker-form")
      .val()
      .toUpperCase();
    let record = [];
    for (const item of apidata) {
      if ($flightNumber === item[1].trim()) {
        record = item;
      }
    }
    //replace current map image with a new one
    $(".track-a-flight")
      .children("img")
      .last()
      .replaceWith(getMap(record));
  });
};
