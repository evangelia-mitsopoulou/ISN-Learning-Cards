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
var URLS_TO_LMS = [ 
					{
						servername: "yellowjacket",
						logoImage: "resources/pfpLogo.png", 
						logoLabel: "Test Server at ISN Zurich",					
						url: "http://yellowjacket.ethz.ch/ilias_4_2/restservice/learningcards",
						debug:"1",
						clientKey: ""
					},
					{
						servername: "hornet",
						logoImage: "resources/pfpLogo.png", 
						logoLabel: "Partnership for Peace LMS at ISN Zurich",
						url: "http://hornet.ethz.ch/scorm_editor/restservice/learningcards",
						debug:"0",
						clientKey: ""
					},
					{
						servername: "PFP LMS",
						logoImage: "resources/pfpLogo.png", 
						logoLabel: "Partnership for Peace LMS at ISN Zurich",
						url: "https://pfp.ethz.ch/restservice/learningcards",
						debug:"0",
						clientKey: ""
					},
					{
						servername: "PFPTEST",
						logoImage: "resources/pfpLogo.png", 
						logoLabel: "Partnership for Peace LMS at ISN/ETH test",
						url: "https://pfp-test.ethz.ch/restservice/learningcards",
						debug:"1",
						clientKey: ""
					}
];

/**
 * TODO: DOCUMENT findServerInfo
 */
function findServerInfo(servername){
	var serverinfo = {}, i;

	for ( i=0; i < URLS_TO_LMS.length; i++ ) {
		if (URLS_TO_LMS[i].servername === servername ){
			serverinfo =  URLS_TO_LMS[i];
		}	
	}

	return serverinfo;	
}

/** Does nothing
 * @function doNothing
 * */
function doNothing() {}



/**opens a view
 * @function openView 
 * */ 
function openView() {
	$(document).trigger("trackingEventDetected",[this.tagID]);
	$("#" + this.tagID).show();
}

 

/**closes  a view
 * @function closeView  
 * */
function closeView() {
	$("#" + this.tagID).hide();
}

/**shows apologize message if not question data is loaded 
 * @function doApologize   
 * */
function doApologize() {
	$("#feedbackBody").empty();
	$("<span/>", {
		text : "Apologize, no data are loaded"
	}).appendTo($("#dataErrorMessage"));
	$("#dataErrorMessage").show();
}


/**Global way of switching on or off the console log messages in all scripts of the front end. 
 * @function moblerlog
 * @param {String}messagestring, the text message to be displayed in the console
 * */
function moblerlog(messagestring) {
	
	//A global property/variable that activates and deactivates the display of console logs.
	var MOBLERDEBUG = 1;
	
   if (MOBLERDEBUG === 1) {
        console.log(messagestring);
    
	}
}

/**Query the database. It is used in all statistics submodels.
 * @function queryDatabase
 * @param cbResult
 * */
function queryDatabase(cbResult){
	moblerlog("enter queryDatabase " + this.modelName);
	var self = this;
	self.superModel.db.transaction(function(transaction) {
                                   transaction.executeSql(self.query, self.values, cbResult, function(tx,e) {moblerlog("DB Error cause: " + self.modelName); self.superModel.dbErrorFunction(tx,e);});
	});
}


/**
 * Each achivement, either a stackhandler or a card burner, should be reached and calculated only once.
 * Check in this function if an achievement of any type (stackhandler or card burner) was already achieved
 * If an achievement has not been reached then the value of the achievement is calculated as normal 
 * @function checkAchievements
 * */
function checkAchievement() {
	var self = this;
	self.superModel.db.transaction(function(transaction) {
		transaction.executeSql( "SELECT * FROM statistics WHERE course_id = ? AND question_id = ?", [this.courseId, this.achievementName], 
                               function cbSuccess(t,r) {
                               if ( r.rows.length > 0 ) {
                                  self.achievementValue = 100;
                                  self.superModel.allDone();
                               } else {
                                  self.calculateAchievementValues();
                               }
                               },
                               self.superModel.dbErrorFunction);
	});
}


/**
 * When an achievement is reached (score =100), it is inserted in the database of the server
 * by assigning the following values for a specific course.
 * - an 100 value to the score
 * - an -100 value to the duration
 * - the achievements name as id for the question
 * * @function insertAchievement
 * */
function insertAchievement() {
	var self = this;
	var insert = 'INSERT INTO statistics(course_id, question_id, day, score, duration) VALUES (?, ?, ?, ?, ?)';
	var insertValues = [ self.courseId, this.achievementName, (new Date()).getTime(), 100, -100];
	self.superModel.queryDB(insert, insertValues, function() {
				moblerlog("successfully inserted achievement");
			});
}


//helper functions

function checkImprovement(improvementValue) {
    var retval = msg_neutralImprovement_icon + " green";
    if (improvementValue > 0) {
        retval = msg_positiveImprovement_icon + " green";
    } else if (improvementValue < 0) {
        retval = msg_negativeImprovement_icon + " red";
    }
    return retval;
}

function checkSpeedImprovement(improvementValue){
    var retval = msg_neutralImprovement_icon + " green";
    if (improvementValue > 0) {
        retval = msg_positiveImprovement_icon + " red";
    } else if (improvementValue < 0) {
        retval = msg_negativeImprovement_icon + " green";
    }
    return retval;
}

