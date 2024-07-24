// Your code goes here
//environment call
require("dotenv").config();
//express initalization
const express = require("express");
//variable to hold express call
const app = express();
//MongoDb Env Url COnnection
const MONGODB = process.env.Mongo_DB_URL;
//Mongoose Initialization
const mongoose = require("mongoose");
//establishing mongodb connection through mongoose
mongoose.connect(MONGODB);
// mongoose connection
const db = mongoose.connection;

//Establish local browser port Number
const PORT = process.env.PORT || 5000;

//Eventlistener to check connection
db.once("open", async () => {
  console.log("*".repeat(10));
  console.log(`Succesfully Connected: \n ${MONGODB}`);
  console.log("*".repeat(10));
});

//Listener router
app.listen(PORT, () => {
  console.log(`Your are connected to Port:${PORT}`);
});

//readline imports
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);
//readline ask function
function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText + "\n", resolve);
  });
}
//async robot/Schema function
async function start() {
  const robotSchema = new mongoose.Schema({
    creatorName: String,
    robotName: String,
    robotColor: String,
    killer: Boolean,
    friend: Boolean,
    serialNumber: Number,
    date: Date,
  });
  const Robot = mongoose.model("robots", robotSchema);

  let action = await ask(
    "Welcome to the robot factory! What do you want to do? (Create, Read, Update, Delete)"
  );
  let creatorName = await ask("Who is the creator");
  let robotName = await ask("Designate this robot?");
  let robotColor = await ask("What color is this robot?");
  let friend = await ask("Is this robot a friend? Enter Y or N");
  let updateTarget = await ask(
    "What is the ID of the robot you want to update?   "
  );
  let updateField = await ask("What field do you want to update?   ");
  let update = await ask("Enter a new value   ");
  if (action === "Create") {
    console.log(creatorName);

    if (friend === "N") {
      (friend = false), (killer = true), console.log("Oh no! A killer robot!");
      (serialNumber = await ask("What is the serial number?")),
        (date = new Date());
      const response = new Robot({
        creatorName: creatorName,
        robotName: robotName,
        robotColor: robotColor,
        friend: friend || null,
        killer: killer || null,
        serialNumber: serialNumber,
        date: date,
      });
      await response.save();
      console.log("Your robot has been created!");
    }
  } else if (action === "Read") {
    let allRobots = await Robot.find({});
    console.log(allRobots);
  } else if (action === "Update") {
    let allRobots = await Robot.find({});
    console.log(allRobots);
    await Robot.updateOne(
      { _id: updateTarget },
      { $set: { [updateField]: update } }
    );
    console.log("Your robot has been updated!");
  } else if (action === "Delete") {
    let allRobots = await Robot.find({});
    console.log(allRobots);
    let target = await ask(
      "what is the ID of the entry do you want to delete?   "
    );
    await Robot.deleteOne({ _id: target });
    console.log("your entry has been deleted");
  } else {
    console.log("invalid entry, try again");
  }
  process.exit();
}
start();
