# david6116.github.io

Technologies used:
*Ajax, JS, jquery, html, css
*OpenskyAPI: https://opensky-network.org/apidoc/index.html
*Google Maps Staticmap API: https://maps.googleapis.com/maps/api/staticmap

Approach 
*This was my first attempt to mess around with jquery/javascript. It started out with something I enjoy, planes, and some bare minimums I wanted to achieve like displaying some flight stats and enabling a user to select a country for country specific stats. The original evolved once I accomplished the original goals. 

Unexpected challenges
*Right off the bat I discovered that each api call can take up 1.5 seconds, obviously that was undesirable. Since I opted not to use a backend of any kind for this project, I decided that on page load I would store a local copy that I could call as I needed without exponential hit to my page load time. 

*On my first pass at making the site I discovered unexpected bugs with an input field. I didn’t initially code for what should happen when a user clicked a submit button with an empty input box. I decided to abandon the idea in favor of a combobox. That had its own issues, like what to do when the user wants stats for the “world.” There isn’t a world option in my API, so I had to build a work around for that in every function. 

Favorite aspects of this project
*It really expanded my appreciation for conditional assignment. I used them in string interpolation and inside if statements.

Link to live site 
* https://david6116.github.io/flightstats/

installation instructions 
*The opensky api is free and requires no registration
*The google images that load require an api key. I’ve opted to upload my key with this project but have severely restricted the key both in the number of calls per day and http referrer. 

unsolved problems 
*Page load speed is still a concern for me. Depending on the number of planes in the sky at time of page load, the site could take up to a couple seconds to rendor. 

*I ended up with a text box on the flight track page. I’d love to spend more time making it more robust, like dealing with empty input, bad input, etc, for now it just silently fails. 

*That crazy high altitude tho.. Every now and then there will be a random plane reporting some 100,000ft + altitude. Some googling on those planes’ tail numbers reveals that these are usually smaller private craft, some used for stunt flying. I should filter these out. There’s no way a plane rated for 15,000ft is flying that high

*Don't select that empty string value from the combobox, plz.

Wish list
*I’d love to get the flight track page to do some real time changes like:

*Move the map pin as updated data is received
*Estimate the time of arrival
*Text alerts
*I’d also like to get rid of the submit button for the combobox on the stats page. Selecting a country should auto submit.

