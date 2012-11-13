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

/*jslint vars: true, sloppy: true */

/** @author Isabella Nake
 * @author Evangelia Mitsopoulou
 */

var MOBLERDEBUG = 0;

// View for displaying the achievements
 
function AchievementsView(controller){
	
	 var self = this;
	 self.controller = controller;  
	 self.tagID = 'achievementsView';
	
	 var prevent=false;
	 jester($('#closeAchievementsIcon')[0]).tap(function(event){
		 moblerlog("achievements: close tap");
		 self.closeAchievements();
		 event.stopPropagation(); } );
	 
	 
	 
	 $(document).bind("loadstatisticsfromserver", function() {
		if (self.tagID === self.controller.activeView.tagID)
	    	{
	    		moblerlog("enters load statistics from server is done");
				 self.controller.models['statistics'].getFirstActiveDay();
	    	}
		  });
	    
	    $(document).bind("allstatisticcalculationsdone", function() { 
	    	moblerlog("enters in calculations done 1 ");
	    if (self.tagID === self.controller.activeView.tagID)
	    	{
	    		moblerlog("enters in calculations done 2 ");
	    		self.showAchievementsBody();
	    	}
	    });
	
}; 


// pinch leads to statistics view

AchievementsView.prototype.handlePinch = function(){
    controller.transitionToStatistics();
};


// tap does nothing
 
AchievementsView.prototype.handleTap = doNothing;


// swipe leads to statistics view

AchievementsView.prototype.handleSwipe = function() {
	controller.transitionToStatistics();
};


// opens the view
 
AchievementsView.prototype.openDiv = openView;

//shows the achievements body

AchievementsView.prototype.open = function() {
	var self=this;
	if (this.controller.getConfigVariable("statisticsLoaded")== true){
	this.showAchievementsBody();
	}
	else {
		self.showLoadingMessage();
	}  
	this.openDiv();	
};

//closes the view
 
AchievementsView.prototype.close = closeView;

//leads to statistics view

AchievementsView.prototype.closeAchievements = function() {
	moblerlog("close Achievements button clicked");
	controller.transitionToStatistics();
};

//shows the achievements

AchievementsView.prototype.showAchievementsBody = function() {
	var statisticsModel = controller.models['statistics'];
	$("#loadingMessageAchievements").hide();
	$("#StackHandlerContainer").show();
	$("#CardBurnerContainer").show();
	$("#stackHandlerIcon").removeClass("blue");
	$("#cardBurnerIcon").removeClass("blue");

	$("#valueStackHandler").text(statisticsModel.stackHandler.achievementValue+"%");
//checkMaxEfficiency(statistics['stackHandler']);

	if (statisticsModel.stackHandler.achievementValue == 100){
		$("#stackHandlerIcon").addClass("blue");			
};
	
	$("#valueCardBurner").text(statisticsModel.cardBurner.achievementValue+"%");

	if (statisticsModel.cardBurner.achievementValue == 100){
			$("#cardBurnerIcon").addClass("blue");			
	};
};


AchievementsView.prototype.showLoadingMessage = function() {
	$("#achievementsBody").hide();
	$("#loadingMessageAchievements").show();	
	
};