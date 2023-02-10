/***************************************************************************
DATA.JS
****************************************************************************/



const data_taskType = {
	categoryName: null,
	taskName: null,
	dueDate: null,
	finDate: null,
	status: null,
	uPredicted: 0,
	sPredicted: 0,
	currentTime: 0,
	overage: 0
};


const data_categoryType = {
	catName: null,
	tasks: null,
};



let data_categories = [];	//: An array of Categories




/*************************************************************************
UTILITIES
**************************************************************************/

data_matchCatName = function(chkName)
{
for (let i = 0; i < data_categories.length; i++)
	{
	if (data_categories[i].catName === chkName)
		{
		return i;
		}
	}

return -1;
}

//*************************************************************************


//: Returns an object with the indexes of the items, or -1 for not found
data_matchCatTskName = function (cname, tname)
{ let rvals = {};

rvals.cat = data_matchCatName(cname);

//--- No cat so no task
if (rvals.cat === -1)
	{
	rvals.task = -1;
	return rvals;
	}

//--- Cat found but there is no task list (no tasks yet)
if (data_categories[rvals.cat].tasks === null)
	{
	rvals.task = -1;
	return rvals;
	}

//--- Cat found, there is a list, search the list return result if task found
for (let i = 0; i < data_categories[rvals.cat].tasks.length; i++)
	{
	if (data_categories[rvals.cat].tasks[i] === chkName)
		{
		rvals.task = i;
		return rval;
		}
	}

//--- Cat found, task not found
rval.task = -1;
return rval;

}




/*************************************************************************
ROUTINES FOR SYSTEM USE
**************************************************************************/

data_createCategory = function (newCatName){

if (data_matchCatName(newCatName) !== -1)
	return true;

let	newCat = Object.create(data_categoryType);
newCat.catName = newCatName;
data_categories.push(newCat);
return false;
}

//*************************************************************************

data_createTaskFromFile = function (dataStr){
let dat = dataStr.split("|");

let	newTaskObj = Object.create(data_taskType);
	newTaskObj.categoryName = dat[0];
	newTaskObj.taskName = dat[1];
	newTaskObj.dueDate = dat[2];
	newTaskObj.finDate = dat[3];
	newTaskObj.status = dat[4];
	newTaskObj.uPredicted = parseInt(dat[5], 10);
	newTaskObj.sPredicted = parseInt(dat[6], 10);
	newTaskObj.currentTime = parseInt(dat[7], 10);
	newTaskObj.overage = parseInt(dat[8], 10);

data_categories[data_categories.length - 1].tasks.push(newTaskObj);
}
//*************************************************************************

data_bundleData = function()
{	let output = "";
for (let i = 0; i < data_categories.length; i++)
	{
	output += data_categories[i].catName + "\n";		//: Save the category name
	if (data_categories[i].tasks === null)
		{
		output += "null\n";	//: Ends tasks
		}
	else		//: Output all tasks for the current category
		{
		for (let j = 0; j < data_categories[i].tasks.length; j++)
			{
			output += data_categories[i].tasks[j].categoryName + "|";
			output += data_categories[i].tasks[j].taskName + "|";
			output += data_categories[i].tasks[j].dueDate + "|";
			output += data_categories[i].tasks[j].finDate + "|";
			output += data_categories[i].tasks[j].status + "|";
			output += data_categories[i].tasks[j].uPredicted.toString(10) + "|";
			output += data_categories[i].tasks[j].sPredicted.toString(10) + "|";
			output += data_categories[i].tasks[j].currentTime.toString(10) + "|";
			output += data_categories[i].tasks[j].overage.toString(10) + "\n";
			}
		output += "null\n";	//: Ends tasks
		}
	}
return output;
}

//*************************************************************************
//let	newTaskObj = Object.create(data_taskType);
/*let	newCat = Object.create(data_categoryType);
newCat.catName = newCatName;
data_categories.push(newCat);*/

data_unbundleData = function(txt)
{	let blocks = txt.split("\n"),	//: Get rid of blank block at the end
			numIterations = blocks.length - 1; //: ignore blank block at the end
			parsingCat = true,
			blk = "";

data_categories = [];

for (let	i = 0; i < numIterations; i++)
	{
	blk = blocks[i];	//: For convenience
	if (parsingCat)		//: Create a new category
		{
		data_createCategory(blk);
		data_categories[data_categories.length -1].tasks = [];
		parsingCat = false;
		}
	else	//: Adding a new task to the current category
		{
		if	(blk === "null")	//: At the end of the tasks
			{
			parsingCat = true;
			}
		else	//: Need to add a task
			{
			data_createTaskFromFile(blk);
			}
		}
	}
for (let i = 0; i < data_categories.length; i++)
	{
	if (data_categories[i].tasks.length === 0)
		data_categories[i].tasks = null;
	}
}



//*************************************************************************

data_deleteCategory = function (deleteName){
let curCat;

for (let i = 0; i < data_categories.length; i++)
	{
	if (data_categories[i].catName === deleteName)	//: We found it
		{
		if (data_categories[i].tasks !== null)	//:	Need to get rid of tasks
			{
			data_categories[i].tasks = null;			//:	Removes the task array
			}
		if (data_categories.length === 1)		//: This was the only category
			{
			data_categories = [];		//: A new empty catagory array ready to use
			}
		else if	(i === (data_categories.length - 1))	//: It is last in the list
			{
			data_categories.pop();	//: Remove it (it's the last element)
			}
		else		//: It is somewhere in the array, but not the last one
			{	//:	We copy the last one over top of the one to delete
				//: Then we get rid of the last
			data_categories[i] = data_categories[data_categories.length - 1];
			data_categories.pop();
			}
		}
	}
}

//*************************************************************************

data_getCatNameList = function ()

{
let list = [];

for (let i = 0; i < data_categories.length; i++)
	list.push(data_categories[i].catName);

list.sort();

return list;
}

//*************************************************************************

data_getTaskNameList = function (catName){
	let list = [];
	for (let i = 0; i < data_categories.length; i++)
	if (data_categories[i].catName === catName)
		{ cloc = i;
		break;
		}
//Make sure curCat isn't -1
	if (cloc === -1)
		{
		return list;
		}
	if (data_categories[cloc].tasks == null)
		{
		return list;
		}
	for (let j = 0; j < data_categories[cloc].tasks.length; j++){
		list.push(data_categories[cloc].tasks[j].taskName)
		}
	return list;
	}


//*************************************************************************

data_createTask = function (catName, taskName, dueDate, uPredicted, currentTime, status){

	if ((taskName.indexOf("|") != -1) || (taskName === "null"))
		return true;	//: | and null have special usages

	let	newTaskObj = Object.create(data_taskType);
	newTaskObj.categoryName = catName;
	newTaskObj.taskName = taskName;
	newTaskObj.dueDate = dueDate;
	newTaskObj.uPredicted = uPredicted;
	newTaskObj.currentTime = currentTime;
	newTaskObj.status = status;
	newTaskObj.finDate = "";
	newTaskObj.overage = 0;

	let idx = data_matchCatName(catName);

	//--- IF NO CATEGORY CREATE IT AND ADD TO NEW
	if (idx === -1)
		{
		data_createCategory(catName);
		data_categories[data_categories.length - 1].tasks = [];
		data_categories[data_categories.length - 1].tasks.push(newTaskObj)
		return false;
		}

	//--- IF CATEGORY IS EMPTY, ADD IT IN
	if (data_categories[idx].tasks == null)
		{
		data_categories[idx].tasks = [];
		data_categories[idx].tasks.push(newTaskObj);
		return false;
		}

	//--- IF GIVEN CATEGORY HAS ALREADY HAS SOMETHING WITH THAT NAME, NO-GO
	for (let j = 0; j < data_categories[idx].tasks.length; j++)
			{
				if (data_categories[idx].tasks[j].taskName === taskName){
					return true;
				}
			}
	data_categories[idx].tasks.push(newTaskObj);
		return false;
}


//*************************************************************************

data_deleteTask = function (catName, taskName){
	let cloc = -1;

	for (let i = 0; i < data_categories.length; i++)
			if (data_categories[i].catName === catName)
			{ cloc = i;
				break;
			}
//Make sure curCat isn't -1
	if (cloc === -1)
		{
			return true;
		}
		let tloc = -1;
	for (let j = 0; j < data_categories[cloc].tasks.length; j++){
				if (data_categories[cloc].tasks[j].taskName == taskName)
					{	tloc = j;
						break;
					}
				}
		if (tloc === -1)
		{
			return true;
		}

		if (data_categories[cloc].tasks.length === 1)
		{
			console.log(data_categories[cloc].tasks)
			data_categories[cloc].tasks = null;
			return false;
		}
		if (data_categories[cloc].tasks[tloc] === data_categories[cloc].tasks.length-1)
		{
			console.log(data_categories[cloc].tasks)
			data_categories[cloc].tasks.pop();
			return false;
		}
		if (data_categories[cloc].tasks[tloc] != data_categories[cloc].tasks.length-1)
		{
			for (var i = data_categories[cloc].tasks.length - 1; i >= 0; i--) {
				console.log(data_categories[cloc].tasks[i])
				console.log(taskName)
 			if (data_categories[cloc].tasks[i].taskName == taskName) {
  				data_categories[cloc].tasks.splice(i, 1);
 			}
		 }
		}
		return false;
	}


//*************************************************************************

data_getCurrent = function (catName, taskName){
		let cloc = -1;

		for (let i = 0; i < data_categories.length; i++)
				if (data_categories[i].catName === catName)
				{ cloc = i;
					break;
				}
	//Make sure curCat isn't -1
		if (cloc === -1)
			{
				return true;
			}
			let tloc = -1;
		for (let j = 0; j < data_categories[cloc].tasks.length; j++){
					if (data_categories[cloc].tasks[j].taskName == taskName)
						{	tloc = j;
							break;
						}
					}
			if (tloc === -1)
			{
				return true;
			}
			var currentTime = -1;
			currentTime = data_categories[cloc].tasks[tloc].currentTime;
			if (currentTime === -1) {
				return true;
			}
			return currentTime;
		}

//*************************************************************************

data_getStatus = function (catName, taskName){
		let cloc = -1;

		for (let i = 0; i < data_categories.length; i++)
				if (data_categories[i].catName === catName)
				{ cloc = i;
					break;
				}
	//Make sure curCat isn't -1
		if (cloc === -1)
			{
				return true;
			}
			let tloc = -1;
		for (let j = 0; j < data_categories[cloc].tasks.length; j++){
					if (data_categories[cloc].tasks[j].taskName == taskName)
						{	tloc = j;
							break;
						}
					}
			if (tloc === -1)
			{
				return true;
			}
			var status = "X";
			status = data_categories[cloc].tasks[tloc].status;
			if (status === "X") {
				return true;
			}
			return status;
		}

//*************************************************************************

data_setStatus = function (catName, taskName, status){
		let cloc = -1;

		for (let i = 0; i < data_categories.length; i++)
				if (data_categories[i].catName === catName)
				{ cloc = i;
					break;
				}
	//Make sure curCat isn't -1
		if (cloc === -1)
			{
				return true;
			}
			let tloc = -1;
		for (let j = 0; j < data_categories[cloc].tasks.length; j++){
					if (data_categories[cloc].tasks[j].taskName == taskName)
						{	tloc = j;
							break;
						}
					}
			if (tloc === -1)
			{
				return true;
			}
			data_categories[cloc].tasks[tloc].status = status;
			return false;
		}

//*************************************************************************

data_setCurrent = function (catName, taskName, current){
		let cloc = -1;
		console.log(catName)
		console.log(taskName)
		console.log(current)

		for (let i = 0; i < data_categories.length; i++)
				if (data_categories[i].catName === catName)
				{ cloc = i;
					break;
				}
	//Make sure curCat isn't -1
		if (cloc === -1)
			{
				console.log("returning here")
				return true;
			}
			let tloc = -1;
		for (let j = 0; j < data_categories[cloc].tasks.length; j++){
					if (data_categories[cloc].tasks[j].taskName == taskName)
						{	tloc = j;
							break;
						}
					}
			if (tloc === -1)
			{
				return true;
			}
			data_categories[cloc].tasks[tloc].currentTime = current;
			return false;
		}

//*************************************************************************

data_getCatHistoryList = function()
{ let catList = [];
			tskLst = [];

for (let i = 0; i < data_categories.length; i++)
	{
	if (data_categories[i].tasks === null)	//: No tasks, move on
		continue;

	tskLst = data_categories[i].tasks;
	for (let j = 0; j < tskLst; j++)
		{
		if (tskLst[j].finDate !== null)
			{
			catList.push(data_categories[i].catName);
			break;
			}
		}
	}
catList.sort();
return catList;
}

//*************************************************************************

data_getTaskHistoryList = function(catName)
{ let tskLst = [];
	let idx = data_matchCatName(catName);

if ((idx < 0) || (data_categories[idx].tasks === null))
	return tskLst;

tskLst = data_categories[idx].tasks;

let tskNames = [];

for (let i = 0; i < tskLst.length; i++)
	{
	if (tskLst[i].finDate !== null)	//: No tasks, move on
		tskNames.push(tskLst[i].taskName)
	}
return tskNames;
}

//*************************************************************************

data_setStatus = function (catName, taskName, status){
		let cloc = -1;

		for (let i = 0; i < data_categories.length; i++)
				if (data_categories[i].catName === catName)
				{ cloc = i;
					break;
				}
	//Make sure curCat isn't -1
		if (cloc === -1)
			{
				return true;
			}
			let tloc = -1;
		for (let j = 0; j < data_categories[cloc].tasks.length; j++){
					if (data_categories[cloc].tasks[j].taskName == taskName)
						{	tloc = j;
							break;
						}
					}
			if (tloc === -1)
			{
				return true;
			}
			data_categories[cloc].tasks[tloc].status = status;
			if (status == "Completed"){
				var today = new Date();
				var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
				data_categories[cloc].tasks[tloc].finDate = date;
				var curtime = data_categories[cloc].tasks[tloc].currentTime;
				var upred = data_categories[cloc].tasks[tloc].uPredicted;
				if (upred == 0)
				{
					upred = 1;
				}
				var over = curtime/upred
				if (curtime < upred)
				{
					over = 0;
				}
				console.log(over)
				data_categories[cloc].tasks[tloc].overage = over;
			}
			return false;
		}

//*************************************************************************

data_getPredicted = function (catName, userPredTime){
	console.log("made it")
	let cloc = -1;

	for (let i = 0; i < data_categories.length; i++)
			if (data_categories[i].catName === catName)
			{ cloc = i;
				break;
			}
//Make sure curCat isn't -1
	if (cloc === -1)
		{
			return 0;
		}
	if (data_categories[cloc].tasks == null)
	{
	return 0;
	}
const	predicted = [];
data_categories[cloc].tasks.sort((a, b) => parseFloat(a.finDate) - parseFloat(b.finDate));
console.log(data_categories[0].tasks)
		for (let i = 0; i < data_categories[cloc].tasks.length; i++){
			if (data_categories[cloc].tasks[i].status == "Completed"){
				predicted.push(data_categories[cloc].tasks[i].overage);
			}
		}
		console.log(predicted)
		if (predicted.length == 0)
		{
			return userPredTime;
		}
		predicted.sort();
		while (predicted.length > 5){
				predicted.pop();
		}
		while (predicted.length < 5){
				predicted.push(1);
		}
		var total=0;
		for(let q = 0; q < 5; q++)
		{ total += predicted[q]; }
		if (total === 0){
			return userPredTime
		}
		total = total/5;
		var predtime = userPredTime * total;

		return predtime;
	}


//*************************************************************************

data_getDueDate = function (catName, taskName){
let cloc = -1;

for (let i = 0; i < data_categories.length; i++)
	if (data_categories[i].catName === catName)
	{ cloc = i;
		break;
	}
//Make sure curCat isn't -1
if (cloc === -1)
	{
	return true;
	}
let tloc = -1;
for (let j = 0; j < data_categories[cloc].tasks.length; j++){
		if (data_categories[cloc].tasks[j].taskName == taskName)
			{	tloc = j;
				break;
			}
		}
if (tloc === -1)
	{
	return true;
	}
var status = "X";
status = data_categories[cloc].tasks[tloc].dueDate;
if (status === "X") {
	return true;
	}
return status;
}

//*************************************************************************

data_getCatHistoryList = function (){
	console.log("Made it here")
let list = [];
console.log(data_categories)
for (let i = 0; i < data_categories.length; i++)
{ if (data_categories[i].tasks == null)
	{
		continue
	}
	for (let j = 0; j < data_categories[i].tasks.length; j++)
	{ console.log(data_categories[i].tasks[j].status)
		if (data_categories[i].tasks[j].status == "Completed")
		{
			list.push(data_categories[i].catName);
		}
	}
}
let uniqueList = [...new Set(list)];
console.log(uniqueList);
	return uniqueList;
}

//*************************************************************************

data_getTaskHistoryList = function (catName){
	let list = [];
	let cloc = -1;
	for (let i = 0; i < data_categories.length; i++)
			if (data_categories[i].catName === catName)
			{ cloc = i;
				break;
			}
//Make sure curCat isn't -1
	if (cloc === -1)
		{
			return list;
		}
	for (let j = 0; j < data_categories[cloc].tasks.length; j++){
		if (data_categories[cloc].tasks[j].status == "Completed")
		{
		list.push(data_categories[cloc].tasks[j].taskName)
		}
	}
return list;
}

//*************************************************************************

data_clearData = function()
{
data_categories = [];
}