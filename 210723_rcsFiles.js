//***********************************
//--- rcsFiles.js
//
// Local file access for HTML files
// Thanks to Manolo Edge,
// https://dev.to/nombrekeff/download-file-from-blob-21ho,
// for downloadBlob
//***********************************

rcs = {};

rcs.downloadTextFile = function (txt, name = 'file.txt') {

	// Convert the txt to a blob
	let txtAry = [txt];
	let txtBlob = new Blob(txtAry);
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  let blobUrl = URL.createObjectURL(txtBlob);

  // Create a link element
  let link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  );

  // Remove link from body
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

/* Usage
let jsonBlob = new Blob(['{"name": "test"}'])
downloadBlob(jsonBlob, 'myfile.json');
*/

//***********************************************************************
// The second parameter is a call back function.  It should have two
// parameters.  The first is the name of the file.  The second is the
// data from the files.
//***********************************************************************

rcs.uploadTextFile = function (theFile){
	let frd = new FileReader();
	frd.onload = function(){
		data_unbundleData(frd.result);
	};
	frd.readAsText(theFile.files[0]);
	theFile.value = '';		//: Clear value so that onchange works w/ same file
												//	if it is requested twice in a row.
}
