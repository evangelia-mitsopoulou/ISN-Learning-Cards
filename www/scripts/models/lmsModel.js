/**	THIS COMMENT MUST NOT BE REMOVED



Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file 
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0  or see LICENSE.txt

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.	


*/

/**
 *  @author Evangelia Mitsopoulou
*/

/*jslint vars: true, sloppy: true */



/**
 *A global property/variable that is used to set the default server with which the application will be connected
 *in order to exchange data.
 *
 *@property DEFAULT_SERVER
 *@default hornet
 **/

var DEFAULT_SERVER = "yellowjacket";

/**
 *A global property/variable that is used to store info about the different servers to which the application can be connected.
 *
 *@property URLS_TO_LMS
 *@default {"yellowjacket", "hornet", "PFP LMS", "PFP TEST"}
 **/
var URLS_TO_LMS = {"yellowjacket":  
					{
						logoImage: "resources/pfpLogo.png", 
						logoLabel: "Test Server at ISN Zurich",					
						url: "http://yellowjacket.ethz.ch/ilias_4_2/restservice/learningcards",
						debug:"1",
						clientKey: ""
					},
					"hornet":  
					{
						logoImage: "resources/pfpLogo.png", 
						logoLabel: "Partnership for Peace LMS at ISN Zurich",
						url: "http://hornet.ethz.ch/scorm_editor/restservice/learningcards",
						debug:"0",
						clientKey: ""
					},
					"PFP LMS":  
					{
						logoImage: "resources/pfpLogo.png", 
						logoLabel: "Partnership for Peace LMS at ISN Zurich",
						url: "https://pfp.ethz.ch/restservice/learningcards",
						debug:"0",
						clientKey: ""
					},
					"PFPTEST":  
					{
						logoImage: "resources/pfpLogo.png", 
						logoLabel: "Partnership for Peace LMS at ISN/ETH test",
						url: "https://pfp-test.ethz.ch/restservice/learningcards",
						debug:"1",
						clientKey: ""
					}
};


/**
 * @class ConfigurationModel 
 * This model holds the data about the current configuration
 * @constructor 
 * It initializes basic properties such as:
 *  - the configuration object of the local storage  
 *  - the url of the selected server,
 *  - the image and the logo of the selected server, 
 * It loads data from the local storage. In the first time there are no data in the local storage. 
 * It specifies the data for the selected server.
 * It listens to an event that is triggered when statistics are sent to the server.
 * @param {String} controller 
 */

function LMSModel(controller) {
	var self=this;
	this.controller = controller;
	//1. initialization of model's variables
	
	//local storage item that will store the data for the LMS's
	// image, label, url
	//taken from the global property above
	this.lmsDataString=[];
	this.urlToLMS = "";
	this.logoimage = "";
	this.logolabel = "";
	self.setLMSData();	
	//proceed by selecting the data of the default server such as url, image, logo, label
	//store in its url in local storage item
	//register if there is no client key otherwise load data from server
	self.selectServerData(DEFAULT_SERVER);
	
	// load data from the local storage if any
	//self.loadData();
}

/**
 * Loads the data from the local storage (key = "configuration") therefore the
 * string is converted into a json object
 * @prototype
 * @function loadData
 */
LMSModel.prototype.loadData = function() {
	var lmsObject;
	//if there is an item in the local storage with the name "configuration"
	//then get it by parsing the string and convert it into a json object
	try {
		lmsObject = JSON.parse(localStorage.getItem("urlsToLMS"));
	} catch (err) {
		moblerlog("error! while loading");
	}

	moblerlog("lmsObject: " + JSON.stringify(lmsObject));
	
	// when the app is launched and before the user logs in there is no local storage 
	// in this case there is no configuration object and it is stated in one of its properties
	// that its login status is set to "loggedOut".
	if (!lmsObject) {
		lmsObject = {};
	}
	
 	//this.lmsDataString = JSON.stringify(lmsObject);
 
};

/**
 * @prototype
 * @function setLMSData
 * @return {Array} answer, the answer of the current active question in an array format which consists of answer items
 */
LMSModel.prototype.setLMSData = function() {
     var x = URLS_TO_LMS;
     //var y=JSON.stringify(x);
     //var y=JSON.parse(x);
     this.lmsDataString=x;
     moblerlog("set lms returns:"+this.lmsDataString);
	
};



/**
 * @prototype
 * @function getLMSData
 * @return {Array} answer, the answer of the current active question in an array format which consists of answer items
 */
LMSModel.prototype.getLMSData = function() {
	return this.lmsDataString;
};



/**
 * Selects the data (url, image, label, clientkey) of the selected lms that are stored in a global variable.
 * It stores the image, label and url of the lms in the constructor's variables.
 * It creates a data structure for storing the client keys of the lms's in local storage. 
 * @prototype
 * @function selectServerData
 * @param {String} servername, the name of the activated server
 */
LMSModel.prototype.selectServerData = function(servername) {
	var self=this;
	var urlsToLMSString = localStorage.getItem("urlsToLMS");
	var urlsToLMS;
	//check if exists in the local storage an object with the name "urlToLMS"
	//that stores the client keys for the various servers
	if (urlsToLMSString && urlsToLMSString.length > 0) {
		try {
			urlsToLMS = JSON.parse(urlsToLMSString);
		} catch(err) {
			moblerlog("Error while parsing urlsToLMS: " + err);
		}	
	} else {
		// create an empty data structure for our clientKeys
		urlsToLMS ={};
		localStorage.setItem("urlsToLMS", JSON.stringify(urlsToLMS));
	}
	//
	this.urlToLMS  = URLS_TO_LMS[servername].url;
	this.logoimage = URLS_TO_LMS[servername].logoImage;
	this.logolabel = URLS_TO_LMS[servername].logoLabel;

	var clientKey;
	// a sanity check if the selected lms exists in the local storage
	// in order to get its client key only in this case
	if (urlsToLMS[servername] ) {
		moblerlog("the current lms has already a client key");
		// then get this client key from the local storage 
		clientKey = urlsToLMS[servername].clientKey;
	}

	//if there is no client key for the selected server
	if (!clientKey || clientKey.length === 0) {
		moblerlog("registration is done");
		//register the app with the server in order to get an app/client key
		 self.controller.models['authentication'].register();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
	} else {
		//if there is an app/cliet key load data of the user from the server
		self.controller.models['authentication'].loadFromServer();
	}
};





/**
* sets the url of the server to the 
* models variable
* @prototype
* @function setServerURL 
* @param {String} servername, the name of the selected lms 
*/
LMSModel.prototype.setServerURL = function(servername) {	
this.urlLMS = URLS_TO_LMS[servername].url;	
};


/**
* @prototype
* @function getServerURL 
* @return {String} urlToLMS, the Url of the activated server 
*/
LMSModel.prototype.getServerURL = function() {
	return this.urlToLMS;
};



/**
* sets the url of the image of the selected server to the 
* models variable
* @prototype
* @function setServerLogoImage 
* @param {String} servername, the name of the selected lms 
* 
*/
LMSModel.prototype.setServerLogoImage = function(servername) {
this.logoimage = URLS_TO_LMS[servername].logoImage;
};


/**
* @prototype
* @function getServerLogoImage 
* @return {String} logoimage, the Url of the logo image of the activated server 
*/
LMSModel.prototype.getServerLogoImage = function(servername) {
	//return this.logoimage;
	return  URLS_TO_LMS[servername].logoImage;
};




/**sets the label of the selected server to the 
* models variable
* @prototype
* @function setServerLogoLabel 
* @param {String} servername, the name of the selected lms 
*/
LMSModel.prototype.setServerLogoLabel = function(servername) {
this.logolabel = URLS_TO_LMS[servername].logoLabel;	
};



/**
* @prototype
* @function getServerLogoLabel 
* @return {String} logolabel, the info label of the activated server
*/
LMSModel.prototype.getServerLogoLabel = function(servername) {
	//return this.logolabel;
	return URLS_TO_LMS[servername].logoLabel;	
};



