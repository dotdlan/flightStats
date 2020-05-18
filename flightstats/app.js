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

  $counterDiv = $("<div>")
    .html(`<p>Current flights in-air</p><p>${numberOfFlights}</p>`)
    .addClass("flight-counter");
  if (lookUpCountry) {
    $(".flight-counter").replaceWith($counterDiv);
  } else {
    $(".counters").append($counterDiv);
  }
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
    .html(
      `<p>Fastest Plane by ground speed</p><p>${record[1]}: ${planeSpeed}MPH</p>`
    )
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
      `<p>Highest plane in the sky</p><p>${record[1] ||
        "Unknown"}: ${highPlane}ft</p>`
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
  $map = $("<img>")
    .addClass("map")
    .attr(
      "src",
      `https://maps.googleapis.com/maps/api/staticmap?zoom=5&size=300x300&maptype=hybrid&markers=color:blue|${mapRecord[6]},${mapRecord[5]}&key=AIzaSyACJV6r7RNNeasGt_vdvf3lhFC71dZFn04`
    );
  return $map;
};
//let's generate a second hidden page within our /index.html that will be
//revealed with .toggle() when the user clicks "Track Flight"
const generateFlightTracker = apidata => {
  $trackContainer = $(".track-container");
  $trackAFlight = $("<div>").addClass("track-a-flight");
  $trackForm = $("<form>");
  $trackInput = $("<input>").attr("type", "text");
  $trackInput.attr("placeholder", "Flight Number:'AAL1234'");
  $trackInput.attr("id", "tracker-form");
  $trackSubmit = $("<div>")
    .attr("id", "track-submit")
    .text("Submit");
  $trackContainer.append($trackAFlight);
  $trackAFlight.append($trackForm);
  $trackForm.append($trackInput).append($trackSubmit);
  $("#track-submit").on("click", event => {
    //would like to make this more durable, if someone uses lowercase flight numbers, for example
    $flightNumber = $("#tracker-form").val();
    let record = [];
    for (const item of apidata) {
      if ($flightNumber === item[1].trim()) {
        record = item;
      }
    }
    //need to add some logic so that this won't display multiple map imgs with subsequent clicks
    $trackAFlight.append(getMap(record));
  });
};
