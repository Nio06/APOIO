//****************************************
//--- Video & Resource Package specific JS
//****************************************

let surp = {};


var catArrayOpened = false;
var paused = false;
var clickedID = ["", ""];
var running = false;
var hisVar = true;
var startTime = 0;
var mils = 0;

//*******************************************************
// Properties
//*******************************************************

//*******************************************************
// Non-Event-Triggered Methods
//*******************************************************

//*******************************************************
// Event-Triggered Methods
//*******************************************************

surp.open = function () {
  //start up software: open categories table
  $("#openDiv").style.display = "block";
  $("#categories").style.display = "none";
  $("#tasks").style.display = "none";
  $("#optionsBar").style.display = "none";
  $("#timerpage").style.display = "none";
  $("#taskentry").style.display = "none";
  $("#reminder").style.display = "none";
//  $("#gFile").dispatchEvent(new Event("change"));;
  clickedID = ["", ""];
  catArrayOpened = false;
  paused = false;
  running = false;
  hisVar = false;
  mils = 0;
  startTime = 0;
}

surp.displayCats = function () {
  $("#taskCatInputSet").style.display = "none";
  $("#taskCatInputSet").innerHTML = "";
  $("#taskCatInput").style.display = "block";
  $("#openDiv").style.display = "none";
  $("#categories").style.display = "block";
  $("#tasks").style.display = "none";
  $("#optionsBar").style.display = "block";
  $("#timerpage").style.display = "none";
  $("#taskentry").style.display = "none";
  $("#reminder").style.display = "block";
  $("#dropbtnCat").style.display = "inline";
  $("#addButton").style.display = "inline";
  $("#catTitle").innerHTML = "CATEGORIES";
  $("#taskTitleH").innerHTML = "CATEGORY:";
  hisVar = true;
  surp.deleteCatTable();
  surp.fillCatTable();
  clickedID[0] = "";
}

surp.fillCatTable = function () {
  if ($("#pOpen") != null) {
    $("#pOpen").remove();
  }
  let catList = new Array;
  if (!hisVar) {
    catList = data_getCatHistoryList();
    $("#dropbtnCat").style.display = "none";
    $("#addButton").style.display = "none";
  } else {
    catList = data_getCatNameList();
    $("#dropbtnCat").style.display = "inline";
    $("#addButton").style.display = "inline";
  }
  surp.deleteCatTable();
  let table = $("#categoryTable");
  for(let i  = 1; i < catList.length+1; i++) {
    // create new table row with empty cells
    var row = table.insertRow(i);
    var c0 = row.insertCell(0);

    // fill first cell with task name
    c0.innerHTML = catList[i - 1];
    var node = document.createElement("P");             // Create a <p> node
    node.id = "pc" + (i - 1);
    var textnode = document.createTextNode(catList[i - 1]);         // Create a text node
    node.appendChild(textnode);                              // Append the text to <li>
    $("#dropCat").appendChild(node);     // Append <p> to <div> with id="dropTask"
    c0.style.backgroundColor = "white";
    c0.style.color = "black";
    c0.id = "ct" + i; // gives current row in current Table an id for click eventListener later
    row.class = "A";
  }
  $("#dropCat").style.maxHeight = "300px";
  $("#dropCat").style.overflow = "auto";
  catArrayOpened = true;
}

surp.deleteCatTable = function () {
  let rowNr = $("#categoryTable").rows.length;
  for (var i = rowNr - 1; i > 0; i--) {
      $("#categoryTable").deleteRow(i);
  }
  for (let i = rowNr - 2; i > -1; i--) {
    let tempID = "#pc" + i.toString();
    $(tempID).remove();
  }
  catArrayOpened = false;
}

surp.openCategory = function (event) {
  let cat = event.target;
  let catID = cat.id; // gets id of clicked category
  if (catID[0] == "c") {
    let tid = "";
    for (let i = 1; i < catID.length; i++){
      tid = tid + catID[i];
    }
    catID = "#" + catID;
    let tempCatName = $(catID).innerHTML;
    clickedID[0] = tempCatName;
    surp.deleteTaskTable();
    surp.fillTaskTable(tempCatName);

    $("#categories").style.display = "none";
    $("#tasks").style.display = "block";
  }
}

surp.fillTaskTable = function (catName) {
  let taskList = new Array;
  if (!hisVar) {
    taskList = data_getTaskHistoryList(catName);
    $("#taskAdd").style.display = "none";
    $("#dropbtnTask").style.display = "none";
  } else {
    taskList = data_getTaskNameList(catName);
    $("#taskAdd").style.display = "inline";
    $("#dropbtnTask").style.display = "inline";
  }
  surp.deleteTaskTable();
  var table = $("#taskTable");
  $("#taskCatTitle").innerHTML = catName;
	for (let i = 1; i < taskList.length+1; i++) {
			// create new table row with empty cells
			var row = table.insertRow(i);
			var c0 = row.insertCell(0);
			var c1 = row.insertCell(1);
      var c2 = row.insertCell(2);

			// fill first cell with task name
			c0.innerHTML = taskList[i-1];
			c1.innerHTML = data_getDueDate(catName, taskList[i-1]);
      c2.innerHTML = data_getStatus(catName, taskList[i-1]);;
      var node = document.createElement("P");             // Create a <p> node
      node.id = "pt" + i;
      var textnode = document.createTextNode(taskList[i-1]);         // Create a text node
      node.appendChild(textnode);                              // Append the text to <li>
      $("#dropTask").appendChild(node);     // Append <p> to <div> with id="dropTask"
      c0.style.backgroundColor = "white";
      c1.style.backgroundColor = "white";
      c2.style.backgroundColor = "white";
      c0.style.color = "black";
      c1.style.color = "black";
      c2.style.color = "black";
			row.id = "tt" + i; // gives current row in current Table an id for click eventListener later
      row.class = "A";
	}
  $("#dropTask").style.maxHeight = "300px";
  $("#dropTask").style.overflow = "auto";
}

surp.deleteTaskTable = function () {
  if ($("#taskCatTitle").innerHTML != "") {
    let rowNr = $("#taskTable").rows.length;
    for (var x = rowNr - 1; x > 0; x--) {
        $("#taskTable").deleteRow(x);
        let tempID = "#pt" + x.toString();
        if ($(tempID) != null){
          $(tempID).remove();
        }
    }
    $("#taskCatTitle").innerHTML = "";
  }
  //$("#taskTable").remove();
}

surp.openStopwatch = function (event) {
  let trow = event.target.parentNode; //this is the clicked row
  let tid = trow.id;
  let temporaryTid = tid[0] + tid[1];
  if (temporaryTid == "tt") {
    var tempID = trow.cells[0].innerHTML; //gets taskName from first cell in clicked row
    clickedID[1] = tempID;
    if ($("#stopwatch").innerHTML == "00:00:00:00" || trow.cells[2].innerHTML == "In Work"){
      if (trow.cells[2].innerHTML == "Paused" || trow.cells[2].innerHTML == "Completed"){
        let curTime = data_getCurrent(clickedID[0], tempID);
        let h = 0;
        let min = 0;
        let sec = "";
        if (curTime > 3600) {
          h = curTime / 3600;
          h = Math.floor(h);
        } else {
          h = 0;
        }
        let hours = "";
        if (h < 10){
          hours = "0" + h.toString();
        } else {
          hours = h.toString();
        }
        if ((curTime - h * 3600) > 60) {
          min = (curTime - h * 3600) / 60;
          min = Math.floor(min);
        } else {
          min = 0;
        }
        let mins = "";
        if (min < 10){
          mins = "0" + min.toString();
        } else {
          mins = min.toString();
        }
        if ((curTime - h * 3600 - min * 60) < 10) {
          sec = (Math.floor(curTime - h * 3600 - min * 60)).toString();
          sec = "0" + sec;
        } else {
          sec = (Math.floor(curTime - h * 3600 - min * 60)).toString();
        }
        $("#stopwatch").innerHTML = hours + ":" + mins + ":" + sec + ":" + "00";
        if (trow.cells[2].innerHTML == "Completed"){
          $("#start").style.display = "none";
          $("#pause").style.display = "none";
          $("#timesubmit").style.display = "none";
        }
      }
      $("#tasks").style.display = "none";
      $("#timerpage").style.display = "block";
      $("#stopwatchTask").innerHTML = clickedID[1];
      $("#stopwatchCat").innerHTML = clickedID[0];
      $("#optionsBar").style.display = "none";
    } else {
      alert("Another Task is still running!");
    }
  }
}

surp.timeStart = function () {
  $("#start").style.display = "none";
  $("#pause").style.display = "inline";
  watch.style.color = "#0f62fe";
  clearInterval(timer);
  start = new Date().getTime();
  if (data_getStatus(clickedID[0], clickedID[1]) != "Paused") {
    data_setCurrent(clickedID[0], clickedID[1], 0);
    millisecound = 0;
    mils = 0;
  } else {
    millisecound = parseInt(data_getCurrent(clickedID[0], clickedID[1]));
    millisecound = millisecound * 1000;
    mils = millisecound;
  }
  timer = setInterval(() => {
    millisecound += 10;

    let currentMillisecondsPassed = new Date().getTime() - start;

    let dateTimer = new Date(currentMillisecondsPassed + mils);


    watch.innerHTML =
      ("0" + dateTimer.getUTCHours()).slice(-2) +
      ":" +
      ("0" + dateTimer.getUTCMinutes()).slice(-2) +
      ":" +
      ("0" + dateTimer.getUTCSeconds()).slice(-2) +
      ":" +
      ("0" + dateTimer.getUTCMilliseconds()).slice(-3, -1);
  }, 10);
  paused = false;
  running = true;
}

surp.timePause = function () {
  let currentTimeString = watch.innerHTML;
  let currentTime = surp.timerGetInt(currentTimeString);
  $("#start").style.display = "inline";
  $("#pause").style.display = "none";
  watch.style.color = "red";
  paused = true;
  clearInterval(timer);
  data_setStatus(clickedID[0], clickedID[1], "Paused");
  data_setCurrent(clickedID[0], clickedID[1], currentTime);
  let table = $("#taskTable");
  for (let i = 1; i < table.rows.length+1; i++) {
    if (table.rows[i].cells[0].innerHTML == clickedID[1]) {
      table.rows[i].cells[2].innerHTML = "Paused";
      break;
    }
  }
  running = false;
}

surp.timerGetInt = function (currentTimeString) {
  let h = parseInt(currentTimeString[0] + currentTimeString[1]);
  let min = parseInt(currentTimeString[3] + currentTimeString[4]);
  let sec = parseInt(currentTimeString[6] + currentTimeString[7]);
  if (h != 0) {
    h = h * 3600;
  }
  if (min != 0) {
    min = min * 60;
  }
  return h + min + sec;
}

surp.submitTime = function () {
  let currentTimeString = watch.innerHTML;
  let currentTime = surp.timerGetInt(currentTimeString);
  $("#start").style.display = "inline";
  $("#pause").style.display = "none";

  clearInterval(timer);
  $("#tasks").style.display = "block";
  $("#timerpage").style.display = "none";
  $("#optionsBar").style.display = "block";

  millisecound = 0;

  let dateTimer = new Date(millisecound);

  watch.innerHTML =
    ("0" + dateTimer.getUTCHours()).slice(-2) +
    ":" +
    ("0" + dateTimer.getUTCMinutes()).slice(-2) +
    ":" +
    ("0" + dateTimer.getUTCSeconds()).slice(-2) +
    ":" +
    ("0" + dateTimer.getUTCMilliseconds()).slice(-3, -1);

  watch.innerHTML = "00:00:00:00";
  data_setCurrent(clickedID[0], clickedID[1], currentTime);
  data_setStatus(clickedID[0], clickedID[1], "Completed");
  let table = $("#taskTable");
  for (var i = 1; i < table.rows.length + 1; i++) {
    if (table.rows[i].cells[0].innerHTML == clickedID[1]) {
      table.rows[i].cells[2].innerHTML = "Completed";
      break;
    }
  }
  clickedID[1] = "";
  running = false;
}

surp.taskStartedTime = function () {
  $("#tasks").style.display = "block";
  $("#timerpage").style.display = "none";
  $("#optionsBar").style.display = "block";
  if (!running) {
    millisecound = 0;

    let dateTimer = new Date(millisecound);

    watch.innerHTML =
      ("0" + dateTimer.getUTCHours()).slice(-2) +
      ":" +
      ("0" + dateTimer.getUTCMinutes()).slice(-2) +
      ":" +
      ("0" + dateTimer.getUTCSeconds()).slice(-2) +
      ":" +
      ("0" + dateTimer.getUTCMilliseconds()).slice(-3, -1);

    watch.innerHTML = "00:00:00:00";
    $("#stopwatchTask").innerHTML = "";
    $("#stopwatchCat").innerHTML = "";
    $("#start").style.display = "inline";
    $("#pause").style.display = "none";
    $("#timesubmit").style.display = "inline";
  } else {
    let table = $("#taskTable");
    for (var i = 1; i < table.rows.length + 1; i++) {
      if (table.rows[i].cells[0].innerHTML == clickedID[1]) {
        table.rows[i].cells[2].innerHTML = "In Work";
        data_setStatus(clickedID[0], clickedID[1], "In Work");
        break;
      }
    }
  }
  clickedID[1] = "";
}

surp.openTaskEntry = function () {
  $("#tasks").style.display = "none";
  $("#categories").style.display = "none";
  $("#taskentry").style.display = "block";
  $("#optionsBar").style.display = "none";
  const d = new Date();
  let day = d.getUTCDate();
  var dateDay = "";
  if (day < 10) {
    dateDay = "0" + day.toString();
  } else {
    dateDay = day.toString();
  }
  let month = d.getUTCMonth() + 1;
  let year = d.getUTCFullYear();
  if (month < 10) {
    $("#taskDateInput").value = year.toString() + "-0" + month.toString() + "-" + dateDay;
  } else {
    $("#taskDateInput").value = year.toString() + "-" + month.toString() + "-" + dateDay;
  }
  $("#predSpan").innerHTML = "";
  if (clickedID[0] != ""){
    $("#taskCatInputSet").style.display = "inline";
    $("#taskCatInputSet").innerHTML = "";
    $("#taskCatInputSet").innerHTML = clickedID[0];
    $("#taskCatInput").style.display = "none";
  } else {
    $("#taskCatInput").style.display = "inline";
    $("#taskCatInputSet").style.display = "none";
  }
}

surp.submitTask = function () {
  let catName = "";
  let newCat = false;
  if ($("#taskCatInputSet").style.display != "none"){
    catName = $("#taskCatInputSet").innerHTML;
  } else {
    catName = $("#taskCatInput").value;
    newCat = true;
  }

  let taskName = $("#taskNameInput").value;
  let dueDate = $("#taskDateInput").value;
  let upredicted = ($("#predMinsInp").value * 60 + $("#predHoursInp").value * 3600);
  let current = 0;
  let status = "Incomplete";
  $("#taskCatInputSet").style.display = "none";
  $("#taskCatInputSet").innerHTML = "";
  $("#taskCatInput").style.display = "block";

  if (newCat) {
    let newCatBool = data_createCategory(catName);
    if (newCatBool) {
      alert("Category already exists");
    } else {
      let taskBool = data_createTask(catName, taskName, dueDate, upredicted, current, status);
      surp.createNewTask(newCat, taskBool);
    }
  } else {
    let taskBool = data_createTask(catName, taskName, dueDate, upredicted, current, status);
    surp.createNewTask(newCat, taskBool);
  }
}

surp.createNewTask = function(newCat, taskBool) {
  if (!taskBool) {
    if (!newCat){
      surp.deleteTaskTable();
      surp.fillTaskTable(clickedID[0]);
      $("#tasks").style.display = "block";
    } else {
      surp.deleteCatTable();
      surp.fillCatTable();
      $("#categories").style.display = "block";
    }

    $("#taskentry").style.display = "none";
    $("#optionsBar").style.display = "block";
    $("#taskNameInput").value = "";
    $("#predMinsInp").value = "";
    $("#predHoursInp").value = "";
    $("#taskCatInput").value = "";
    const d = new Date();
    let day = d.getUTCDate();
    var dateDay = "";
    if (day < 10) {
      dateDay = "0" + day.toString();
    } else {
      dateDay = day.toString();
    }
    let month = d.getUTCMonth() + 1;
    let year = d.getUTCFullYear();
    if (month < 10) {
      $("#taskDateInput").value = year.toString() + "-0" + month.toString() + "-" + dateDay;
    } else {
      $("#taskDateInput").value = year.toString() + "-" + month.toString() + "-" + dateDay;
    }
    $("#predSpan").innerHTML = "";
  } else {
    alert("Task already exists in this category");
    $("#taskCatInput").style.display = "none";
    $("#taskCatInputSet").style.display = "block";
    $("#taskCatInputSet").innerHTML = clickedID[0];
  }
}

surp.cancelTaskCreate = function () {
  if ($("#taskCatInput").style.display != "none") {
    $("#categories").style.display = "block";
  } else {
    $("#tasks").style.display = "block";
  }
  $("#taskentry").style.display = "none";
  $("#optionsBar").style.display = "block";
  $("#taskNameInput").value = "";
  $("#predMinsInp").value = "";
  $("#predHoursInp").value = "";
  $("#taskCatInput").value = "";
  $("#taskCatInputSet").style.display = "none";
  $("#taskCatInputSet").innerHTML = "";
  $("#taskCatInput").style.display = "block";
  const d = new Date();
  let day = d.getUTCDate();
  var dateDay = "";
  if (day < 10) {
    dateDay = "0" + day.toString();
  } else {
    dateDay = day.toString();
  }
  let month = d.getUTCMonth() + 1;
  let year = d.getUTCFullYear();
  if (month < 10) {
    $("#taskDateInput").value = year.toString() + "-0" + month.toString() + "-" + dateDay;
  } else {
    $("#taskDateInput").value = year.toString() + "-" + month.toString() + "-" + dateDay;
  }
  $("#predSpan").innerHTML = "";
}

surp.showPredicted = function () {
  let pHours = $("#predHoursInp").value;
  let pMins = $("#predMinsInp").value;
  if (pHours == null || pHours == "" || pMins == null || pHours == "") {
    alert ("Put in predicted hours and minutes before clicking hint.");
  } else {
    let iPHours = parseInt(pHours);
    let iPMins = parseInt(pMins);
    iPMins = iPMins * 60 + iPHours * 3600;
    let spred = data_getPredicted(clickedID[0], iPMins);
    if (spred != 0) {
      if (spred > 3599) {
        var h = spred / 3600;
        h = Math.floor(h);
        spred = spred - h * 3600;
      } else {
        var h = 0;
      }
      if (spred > 59) {
        var m = spred / 60;
        m = Math.floor(m);
        spred = spred - m * 60;
      } else {
        var m = 0;
      }
      var hs = "";
      if (h < 10) {
        hs = "0" + h;
      } else {
        hs = h;
      }
      var ms = "";
      if (m < 10) {
        ms = "0" + m;
      } else {
        ms = m;
      }
      var spreds = "";
      if (spred < 10) {
        spreds = "0" + spred;
      } else {
        spreds = spred;
      }
      $("#predSpan").innerHTML = hs + ":" + ms + ":" + spred;
    } else {
      $("#predSpan").innerHTML = "No Hint available";
    }
  }
}

surp.deleteTask = function (event) {
  let taskName = event.target.innerHTML;
  if (confirm("Delete Task: " + taskName)){
    data_deleteTask(clickedID[0], taskName);
    surp.deleteTaskTable();
    surp.fillTaskTable(clickedID[0]);
  }
}

surp.deleteCat = function (event) {
  let catName = event.target.innerHTML;
  if (confirm("Delete Category: " + catName)) {
    data_deleteCategory(catName);
    surp.deleteCatTable();
    surp.fillCatTable();
  }
}

surp.createCat = function () {
  let catName = prompt("Enter a title for the new category: ", "Category Name");
  if (catName != "" && catName != null) {
    if(data_createCategory(catName)) {
      alert("The category name already exists");
    } else {
      surp.deleteCatTable();
      surp.fillCatTable();
    }
  }
}

surp.saveIt = function() {
  if (running) {
    alert("A task is still running.");
  } else {
	   let fname = prompt("Please enter a new file name", "Apoio.txt");
    if (fname != null) {
      let dat = data_bundleData();
	    if (fname == "") {
		    fname = "file.txt";
	    }

	    rcs.downloadTextFile(dat, fname);
      alert("Saved successfully");
      surp.open();
      data_clearData();
    }
  }
}

surp.readFile = function() {
  $("#openDiv").style.display = "none";
	rcs.uploadTextFile($("#gFile"));
  // step before opening categories to give it time to read it
  var node = document.createElement("P");             // Create a <p> node
  node.id = "pOpen";
  var textnode = document.createTextNode("Welcome!");         // Create a text node
  node.appendChild(textnode);                              // Append the text to <li>
  $("#body").appendChild(node);     // Append <p> to <div> with id="dropTask"
  $("#optionsBar").style.display = "block";
  node.style.margin = "0em 4em 0em 4em";
  node.style.fontFamily = "American Typewriter, Copperplate, monospace";
  node.style.fontSize = "2em";
}

surp.hisFunc = function() {
  hisVar = false;
  $("#openDiv").style.display = "none";
  $("#categories").style.display = "block";
  $("#tasks").style.display = "none";
  $("#optionsBar").style.display = "block";
  $("#timerpage").style.display = "none";
  $("#taskentry").style.display = "none";
  $("#reminder").style.display = "block";
  $("#dropbtnCat").style.display = "none";
  $("#addButton").style.display = "none";
  $("#catTitle").innerHTML = "HISTORY";
  $("#taskTitleH").innerHTML = "HISTORY:";
  surp.deleteCatTable();
  surp.fillCatTable();
  clickedID[0] = "";
}

//*******************************************************
// Setting things up
//*******************************************************

surp.open();
$("#catBtn").addEventListener("click", surp.displayCats);
$("#categoryTable").addEventListener("click", surp.openCategory);
$("#taskTable").addEventListener("click", surp.openStopwatch);
$("#start").addEventListener("click", surp.timeStart);
$("#pause").addEventListener("click", surp.timePause);
$("#timesubmit").addEventListener("click", surp.submitTime);
$("#taskStartedTime").addEventListener("click", surp.taskStartedTime);
$("#taskAdd").addEventListener("click", surp.openTaskEntry);
$("#addButton").addEventListener("click", surp.openTaskEntry);
$("#tasksubmit").addEventListener("click", surp.submitTask);
$("#taskcancel").addEventListener("click", surp.cancelTaskCreate);
$("#showPredicted").addEventListener("click", surp.showPredicted);
$("#dropTask").addEventListener("click", surp.deleteTask);
$("#dropCat").addEventListener("click", surp.deleteCat);
$("#newCat").addEventListener("click", surp.createCat);
$("#gFile").addEventListener("change", surp.readFile);
$("#savBtn").addEventListener("click", surp.saveIt);
$("#newUser").addEventListener("click", surp.displayCats);
$("#hisBtn").addEventListener("click", surp.hisFunc);
