'use strict';

let vorpal = require('vorpal')();
const chalk = require('chalk');
let CLI = require('clui');
var figlet = require('figlet');
console.log(
  chalk.blue(
    figlet.textSync('My Contact App', {
      horizontalLayout: ''
    })
  )
);

console.log(chalk.bold.blue("An app that allows you add a contact to your database,") +
  chalk.bold.blue("search for an existing contact, sends a text to a contact in the database.\n"))

console.log(chalk.bold.underline.red("Guide:\t"))

console.log(chalk.bold.blue("Follow this guide and you are on your way " +
  " to exploring this great app."))

console.log(chalk.bold.red("add -n <name> -p <phoneNumber>:") + " " +
  chalk.bold.red("Adds contact to database" + "\n") +
  chalk.bold.red(" search <name>: searches for a contact " + "\n") +
  chalk.bold.red(" text <name> -m <message>: sends sms to specified contact"));

let fireBase = require('./functs.js')

vorpal
  .command('add <name> -p <phoneNumber>', 'Add user datas')
  .option('-n, --name', "Adds full name e.g 'Andela Clinton' ")
  .option('-p, --phoneNumber', "Adds phone number e.g 080******** ")
  .description('Outputs "save".')
  .action(function(args, callback) {
    let new_number = args.phoneNumber; //Convert user input to a string so we can get the length
    let fullName = args.name;
    new_number = "0" + new_number.toString();
    let reg = /[0-9]/;
    let contactName = fullName.split(" "); //Splitting the names value to get first and last name
    if (fullName.length > 3 && new_number.length === 11 &&
      contactName[1] != undefined &&
      (!reg.test(contactName[0]) && (!reg.test(contactName[1])))) { //Validating user input

      if (fireBase.addToDataBase(contactName[0], contactName[1], new_number)) {
        console.log(chalk.bold.green("Added Successfully!"))
      }

    } else if (contactName[1] === undefined) {
      console.log(chalk.bold.yellow("Invalid name entered: use the add -n command to enter your 'firstname and lastname' "))

    } else {
      console.log(chalk.bold.red("Invalid details supplied!! /Enter a valid name and phonenumber"))
    }

    callback();
  });

//vorpal command for saerch function
vorpal
  .command('search <name>', 'searches for a users data')
  .option('search', "searchs for users firstname e.g 'Andela' ")
  .description('Outputs "search"')
  .action(function(args, callback) {
    var searchTerms = args.name;
    fireBase.searchContact(searchTerms)

  });

// vorpal command for sending text to user
vorpal
  .command('text <name>', 'Sends sms to contact')
  .option('-m, --message', "Sends specified message to user")
  .description('Outputs "send sms"')
  .action(function(args, callback) {
    var name = fireBase.searchContact(args.name);
    var new_message = args.message;

    name.then(function(result) {
      console.log()
    })

    callback();
  });

vorpal
  .delimiter('Contact-App$')
  .show();