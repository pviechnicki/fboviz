/*---------------------------------------------------------------------*/
/* Build a treemap of the fbo data                                     */
/*---------------------------------------------------------------------*/

<<<<<<< HEAD
//Read local api key file, store in variable
//Used synchronous request, since it's a small local file
//var xmlhttp = new XMLHttpRequest;
//xmlhttp.open("GET","https://github.com/pviechnicki/fboviz/blob/gh-pages/api.data.gov.key.txt",false);
//xmlhttp.send();
//myKey = xmlhttp.responseText.replace(/\s+$/g, '');
=======
/*---------------------------------------------------------------------*/
/* Global variables                                                    */
/*---------------------------------------------------------------------*/
>>>>>>> master

//Would be better to figure out a way to have individual users use their own keys
var myKey = "S5y3cV2CbjFclfTKEBJuA3m8gDJvrOkZH1wXKk5a";

//URL for fbopen api call
var dataURL = "https://api.data.gov/gsa/fbopen/v0/opps?api_key=" + myKey + "&q=notice_type:\"COMBINE\"&show_closed=true&limit=500";

var viz = d3plus.viz(); //Handle to d3plus treemap viz object
var tableHandle = {}; //Handle to table

//Storage for different slices of the data
var fboData; //Will hold raw solicitation-level records
var filteredFBOData; //holds subset of detail data for table
var fboPSCCounts; //Will hold counts of each category of solicitation
var fboAgencyCounts; //Will hold counts of solicitations per agency

<<<<<<< HEAD
=======
var tableType= "psc"; //Switch for how the detail records are grouped

/*---------------------------------------------------------------------*/
/* Main functionality.                                                 */
/*---------------------------------------------------------------------*/
>>>>>>> master

getJSON(dataURL).then(function(response) {

    //Transform the raw json data into counts of each product code
    fboData = objectify(response);
    var temp = countProducts(fboData);
    fboPSCCounts = addPSCLabels(temp);
    fboAgencyCounts = countAgencies(fboData);

    //Create the treemap
    viz.container("#fbo_treemap")
	.title("Products and Services")
	.data(fboPSCCounts)
	.type("tree_map")
	.id("psc")
	.size("count")
	.tooltip("psc_label")
	.mouse({
	    "move": false,
	    "click": function(d, viz){
		if (tableType == "psc")
		{
		    switchTableData("FBO_CLASSCOD", d.psc, tableHandle);
		}
		else if (tableType == "agency")
		{
		    switchTableData("agency", d.agency, tableHandle);
		}
	    }
	})
        .ui([{"method": function(value, viz)
              {
                  if (value == "Product/Service Code")
                  {
                      viz.data(fboPSCCounts)
                          .id("psc")
			  .title("Products and Services")
                          .draw();
		      viz.tooltip("psc_label"); //Make sure the tooltips work
		      switchTableType("psc"); //Switch the table to group by Psc

                  }
                  else if (value == "Agency")
                  {
                      viz.data(fboAgencyCounts)
                          .id("agency")
			  .title("Purchases by Agency")
                          .draw();
		      viz.tooltip("agency"); //Make sure tooltips have correct val
		      switchTableType("agency"); //Switch lower table to display agency records

                  }
                  // switchData(value);
              },
              "label": "Group Opportunities By:",
              "value": ["Product/Service Code", "Agency"]}
	    ])
	.draw();

    //Put detail data into the table

    filteredFBOData = filter(fboData, "FBO_CLASSCOD", "70");
    tableHandle = $('#fbo_table').dynatable({
	table:
	{
	    defaultColumnIdStyle: 'underscore'
	},
	dataset:
	{
	    records: filteredFBOData,
	    perPageDefault: 3
	}
    });

});


