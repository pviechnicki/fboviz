//Helper functions for FBO viz
/*--------------------------------------------------*/
/* Get information from a URL                       */
/* From Haverbeke pg 308                            */
/*--------------------------------------------------*/
function get(url) {
    return new Promise(function(succeed, fail) {
      	var req = new XMLHttpRequest();
      	req.open("GET", url, true);
      	req.addEventListener("load", function() {
    	    if (req.status < 400)
        		succeed(req.responseText);
    	    else
        		fail(new Error("Request failed: " + req.statusText));
      	});
      	req.addEventListener("error", function() {
    	    fail(new Error("Network error"));
      	});
      	req.send(null);
    });
}
/*------------------------------------------------------------*/
/* Return a promise whose result is the content of the url    */
/* parsed as JSON                                             */
/* Haverbeke pg. 309                                          */
/*------------------------------------------------------------*/
function getJSON(url) {
    return get(url).then(JSON.parse);
}
/*------------------------------------------------------------*/
/* Transform data into array of objects                       */
/*------------------------------------------------------------*/
function objectify(inputData) {

    //Construct new empty array for outputs
    var outputData = [];

    //Loop through all rows of input data and store in output array
    for (var i = 0; i < inputData.docs.length; i++) {
	var newObject = {};
	newObject = inputData.docs[i];
	outputData.push(newObject);
    }
    return outputData;
}
/*------------------------------------------------------------*/
/* Count instances of each product code and subcode           */
/*------------------------------------------------------------*/
function countProducts(data)
{
    var counts = [];
    var myClassCode;
    for (var i = 0; i < data.length; i++)
    {
	myClassCode = data[i].FBO_CLASSCOD;
	mySuperCategory = myClassCode.substring(0,2);
	//Loop through entire counts db. If new, add a new record,
	//if not, increment
	//There has got to be a better way than this
	matchState = false;
	for (var j = 0; j < counts.length; j++)
	{
	    if (counts[j].psc == myClassCode)
	    {
		counts[j].count++;
		counts[j].super_category = mySuperCategory;
		matchState = true;
		break;
	    }
	}
	//If we didn't match anything in counts, then add a new record
	if (!matchState)
	{
	    counts.push({"psc":myClassCode, "super_category":mySuperCategory, "count":1});
	}
    }
    return(counts);
}
/*------------------------------------------------------------*/
/* Count instances of each agency solicitations               */
/*------------------------------------------------------------*/
function countAgencies(data)
{
    var counts = [];
    var myAgency;
    for (var i = 0; i < data.length; i++)
    {
	myAgency = data[i].agency;
	//Loop through entire counts db. If new, add a new record,
	//if not, increment
	//There has got to be a better way than this
	matchState = false;
	for (var j = 0; j < counts.length; j++)
	{
	    if (counts[j].agency == myAgency)
	    {
		counts[j].count++;
		matchState = true;
		break;
	    }
	}
	//If we didn't match anything in counts, then add a new record
	if (!matchState)
	{
	    counts.push({"agency":myAgency, "count":1});
	}
    }
    return(counts);
}

/*------------------------------------------------------------*/
/* Add psc_code labels to the counts array                    */
/*------------------------------------------------------------*/
function addPSCLabels(inputData)
{
    var outputData = [];

    for (var i = 0; i < inputData.length; i++)
    {
	var newRecord = inputData[i];
	//Loop through psc codes table and find label matching this code
	var matchState = false;
	for (var j=0; j< psc_codes.length; j++)
	{
	    if (newRecord.psc == psc_codes[j].PSC_CODE.trim())
	    {
		newRecord.psc_label = psc_codes[j].PSC_NAME;
		matchState = true;
		break;
	    }
	}
	if (!matchState)
	{
	    newRecord.psc_label = "Not Found";
	}
	outputData.push(newRecord);
	     
    }
    return(outputData);
}

/*------------------------------------------------------------*/
/* Switch the dataset used to create the treemap, redraw      */
/*------------------------------------------------------------*/
function switchData(value)
{
    if (value == "Product/Service Code")
    {
	viz.data(fboPSCCounts);
    }
    else if (value == "Agency")
    {
	viz.data(fboAgencyCounts);
	viz.tooltip("agency");
    }
}

/*------------------------------------------------------------*/
/* Filter a dataset according to a value for a field          */
/*------------------------------------------------------------*/
function filter(inputData, field, value)
{
    var outputData = [];
    for (var i = 0; i < inputData.length; i++)
    {
	if (inputData[i][field] == value)
	{
	    var newRecord = {};
	    newRecord = inputData[i];
	    outputData.push(newRecord)
	}
    }
    return outputData;
}
/*------------------------------------------------------------*/
/* Switch detailed data in table according to new PSC code    */
/*------------------------------------------------------------*/
function switchTableData(value, tableHandle)
{
    var tempData = [];
    tempData = filter(fboData, "FBO_CLASSCOD", value);
    filteredFBOData = tempData;
    tableHandle.data('dynatable').settings.dataset.records = filteredFBOData;
    tableHandle.data('dynatable').settings.dataset.perPageDefault = 3;
    tableHandle.data('dynatable').dom.update();

}
