var mongoose= require("mongoose");

let countrySchema= new mongoose.Schema({
    name: String,
    total_population: String,
    eggs_produced: String,
    eggs_consumption: String
});

module.exports= mongoose.model("Country", countrySchema);