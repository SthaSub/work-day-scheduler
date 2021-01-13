$(document).ready(function () {
  /**
   * required varibles for row, col , and time 
   */
  var row = [];
  var input;
  var col1;
  var col2;
  var col3;
  var timeFromNineAM = 8; //intialise with value 8 for 9 am
  var timeFromTwelvePM = 0; //it indicates 12 pm value
  var table; // variable for table tag
  var LocalDateTime = JSJoda.LocalDateTime; // object creation from js-joda library 
  var t = LocalDateTime.now(); //gets the system's current date, and time in 24 hour format
  var parseDateAndTime = JSJoda.convert(t).toDate(); // gets parse value of date and time form JS library function toDate()
  /**
   * object creation for formatting the month, year and day
   */
  var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  var currentDate = $("#currentDay"); // getting id form index page

  var ta = JSJoda.LocalTime.parse("13:42"); // gets the current time from the system
  var rowColTime = { rowCol: "", timeHour: "" }; //object to row column tag and hour from the table
  var timeArray = []; // stores the rowColTime obj

  var getCurrentHour = parseInt(ta._hour); //gets hour from ta variable
  var timeIn24HourArray = [9, 10, 11, 12, 13, 14, 15, 16, 17]; // time array containing 9 to 17 hours of day.
  var amTime; // stores the am time only
  
  /**
   * Entry point of program
   */
  main();
  function main(){
    tableGeneration();
    cssForTable();
    getJSJodaTime();
    saveListener();
    getDataFromLocalStorage();  
  }

  /**
   * generates tables and its row and columns, also assigned the time for each row.
   */
  function tableGeneration() {
    for (var r = 0; r < 9; r++) {
      input = $("<textarea id=\"input1\" placeholder=\"Enter your event here\"></textarea>");
      col1 = $("<td class=\"coln1\">");
      col2 = $("<td class=\"coln2\">");
      col3 = $("<td class=\"coln3 saveBtn\">");
      row[r] = $("<tr class=" + "row" + (r + 1) + ">");
      if (r <= 3) {
        timeFromNineAM = timeFromNineAM + 1;
        if (timeFromNineAM === 12)
          row[r].append(col1.text(timeFromNineAM + "\tpm"), col2.append(input), col3);
        else
          row[r].append(col1.text(timeFromNineAM + "\tam"), col2.append(input), col3);
      } else if (r > 3) {
        timeFromTwelvePM += 1;
        row[r].append(col1.text(timeFromTwelvePM + "\tpm"), col2.append(input), col3);
      }
    }
  }

  /**
   * modified and generated css for table
   */
  function cssForTable() {
    table = $("<table class=\"table table-bordered\">"); //table tag with bootstarp table class
    table.css("border", "none");
    table.append(row);
    $(".container").append(table);
    $(".coln1").addClass("time-block").css({ "border-right": "1px solid", "font-weight": "600" });
    $(".coln2").addClass("past").css({ "border": "1px solid white" });
    $(".coln2" + " #input1").attr("readonly", true);
    $(".coln3").append("<i class=\"fad fa-save\" title=\"Click here to save event\"></i>");
    $(".coln3").css({ "background-color": "skyblue", "text-align": "center" });
  }

  /**
   * time extraction from system using js joda library object 
   */
  function getJSJodaTime() {
    currentDate.text(parseDateAndTime.toLocaleDateString('en-AU', options)); // sets text to id for example, Monday, 11 January 2021

    for (var c = 0; c < 9; c++) {
      rowColTime.rowCol = ".row" + (c + 1) + " td:nth-child(2)";
      rowColTime.timeHour = parseInt($(".row" + (c + 1) + " td:nth-child(1)").text().split("\t")[0]); // gets numeric value from column like 9 from 9 am
      timeArray[c] = rowColTime;
      rowColTime = {}; // clears the object to get next value from table 
    }

    for (var key in timeArray) {
      if (getCurrentHour > 12)
        amTime = getCurrentHour - 12; //makes 24 hour to 12 hour time like 13 to 1 pm
      else
        amTime = getCurrentHour; // gets current hour from system
      if (timeArray[key].timeHour === amTime) {
        $(timeArray[key].rowCol).addClass("present"); // displays as red colour in table
      } else if (timeIn24HourArray[key] > getCurrentHour) {
        $(timeArray[key].rowCol).addClass("future"); //displays as green colour in table
        $(timeArray[key].rowCol + " #input1").attr("readonly", false); // prevents entering the data in textarea
      }
    }
  }

  /**
   * this function takes action for saving data in localstorage
   */
  function saveListener() {
    $(".coln3 i").on("click", function () {

      var row = $(this).parent().parent()[0]; // gets grandparent tag from current target
      var eventRowColClass = $("." + row.className + " td:nth-child(2) #input1"); //for example, .row1 td:nth-child(2) #input1
      if (eventRowColClass.attr("readonly") == "readonly") {
        alert("Cannot edit or insert new event in past and present time");
        return;
      }
      var timeRowColClass = $("." + row.className + " .coln1.time-block"); //for instance, .row1 .coln1.time-block
      var selectedTime = timeRowColClass.text().split("\t")[0];
      var result = localStorageData(selectedTime, eventRowColClass.val());
      if (result == "edited") alert("Event edited");
      else if (result == "newEvent") alert("New Event inserted");
    });
  }

  /**
   * this function works for saving the entered data from user
   */
  function localStorageData(time, eventName) {
    if (eventName == "") {
      alert("No event entered!!") // return undefined if nothing entered in textarea
      return;
    }
    for (var index = 0; index < localStorage.length; index++) {
      var element = localStorage.key(index);
      if (element == time) {
        localStorage.setItem(time, eventName);
        return "edited";
      }
    }
    localStorage.setItem(time, eventName);
    return "newEvent";
  }

  /**
   * performs to get data from localstorage and displays on each textarea
   */
  function getDataFromLocalStorage() {
    for (var i = 0; i < localStorage.length; i++) {
      for (var j = 0; j < timeArray.length; j++) {
        if (timeArray[j].timeHour == localStorage.key(i)) {
          var getLocalData = localStorage.getItem(localStorage.key(i)); // gets localStorage value by key
          $(timeArray[j].rowCol + " #input1").text(getLocalData); // sets value of localstorage to textarea
        }
      }
    }

  }
});