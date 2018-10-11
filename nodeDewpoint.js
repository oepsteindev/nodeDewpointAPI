const Joi = require('joi');
var Request = require("request");
const express = require('express');
const app = express();


app.post('/dewpoint/:zip', (req, res) => {

  const zip = req.params.zip;
  const { error } = validate({zip}); 
  if (error) return res.status(400).send(error.details[0].message);

 let weather = Request.get(`https://api.wunderground.com/api/<your api key here>/forecast/geolookup/conditions/q/${zip}/format.json`, (error, response, body) => {
	    if(error) {
	        return console.dir(error);
	    }
	    console.dir(JSON.parse(body));

	    let resp = JSON.parse(body);

	    let bad_hair_cat = 'http://img06.deviantart.net/2c2a/i/2013/236/5/5/doodle_237___persian_cat_by_giovannag-d6jlpei.jpg';
        let good_hair_cat = 'http://i.imgur.com/ZiEBSak.jpg?1';
        let img_height = 200;
        let img_width = 200;
        let location = resp['location']['city'];
        let temp_f = resp['current_observation']['temp_f'];
        let dewpoint = resp['current_observation']['dewpoint_string'];
        let dewpoint_f = resp['current_observation']['dewpoint_f'];
        let humidity = resp['current_observation']['relative_humidity'];
        let icon_url = resp['current_observation']['icon_url'];
        let image = (dewpoint_f > 65 ? "<img src='" + bad_hair_cat + "' height='" + img_height + "' width='" + img_width + "'>" : "<img src='" + good_hair_cat + "' height='" + img_height + "' width='" + img_width + "'>")
        let desc = (dewpoint_f > 65 ? "Bad hair day! Run!" : "Good hair day, good kitty!");
        let color = (dewpoint_f > 65 ? "red" : "green");


	    let theWeather = [];
	    theWeather.push({ 
	    	'location': location, 
	    	'temp_f': temp_f,
	    	'dewpoint':  dewpoint,
	    	'dewpoint_f':  dewpoint_f,
	    	'humidity': humidity,
	    	'icon_url': icon_url,
	    	'img_width': img_width,
	    	'img_height': img_height,
	    	'image': image,
	    	'desc': desc,
	    	'color': color
	    	});
        
	    res.send(theWeather);
	});
 
});

function validate(zip) {
  const schema = {
    zip: Joi.string().min(5).required()
  };

  return Joi.validate(zip, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));