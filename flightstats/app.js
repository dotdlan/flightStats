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
    console.log($countries);
    $newCountry = $("<option>")
      .attr("value", `${country}`)
      .text(country);
    console.log($newCountry);
    $countries.append($newCountry);
  }
};

//let's calculate the total number of flights in the air.
const calculateflights = (apidata, lookUpCountry) => {
  let numberOfFlights = 0;
  console.log(lookUpCountry === undefined);
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
  for (const item of apidata) {
    let i = 0;
    if (lookUpCountry === undefined || lookUpCountry === "World") {
      if (item[9] > planeSpeed) {
        planeSpeed = item[9];
      }
    } else if (item[2] === lookUpCountry) {
      if (item[9] > planeSpeed) {
        planeSpeed = item[9];
      }
    }
  }
  planeSpeed = Math.floor(planeSpeed * 2.24);
  $counterDiv = $("<div>")
    .html(`<p>Fastest Plane by ground speed (MPH)</p><p>${planeSpeed}</p>`)
    .addClass("speed-counter");
  if (lookUpCountry) {
    $(".speed-counter").replaceWith($counterDiv);
  } else {
    $(".counters").append($counterDiv);
  }
};

//let's figure out which is the highest
const highestPlane = (apidata, lookUpCountry) => {
  let highPlane = 0;
  for (const item of apidata) {
    if (lookUpCountry === undefined || lookUpCountry === "World") {
      if (item[7] > highPlane) {
        highPlane = item[7];
      }
    } else if (item[2] === lookUpCountry) {
      if (item[7] > highPlane) {
        highPlane = item[7];
      }
    }
  }
  highPlane = Math.floor(highPlane * 3.281);
  $counterDiv = $("<div>")
    .html(`<p>Highest plane in the sky (feet)</p><p>${highPlane}</p>`)
    .addClass("height-counter");
  if (lookUpCountry) {
    $(".height-counter").replaceWith($counterDiv);
  } else {
    $(".counters").append($counterDiv);
  }
};
