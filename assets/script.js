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
  var table;
  /**
   * functions
   */
  tableGeneration();
  cssForTable();

  function tableGeneration(){
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

  function cssForTable(){
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

  
});