function CoursesListView(controller) {

	var self = this;

	self.tagID = 'coursesListView';
	self.controller = controller;

	self.active = false;

	self.firstLoad = true;
	
	// $('#coursesListSetIcon').click(function(){ self.clickSettingsButton(); }
	// );
	jester($('#coursesListSetIcon')[0]).tap(function() {
		self.clickSettingsButton();
	});

	$(document).bind("questionpoolready", function(e, courseID) {
		console.log("view questionPool ready called " + courseID);
		self.courseIsLoaded(courseID);
	});

	$(document).bind("courselistupdate", function(e) {
		console.log("course list update called");
		self.firstLoad = false;
		if (self.active) {
			console.log("course list view is active");
			self.update();
		}
	});
	
	function setOrientation() {
       	self.setIconSize(); 
    }
    
    //when orientation changes, set the new width and height
    //resize event should be caught, too, because not all devices
    //send an oritentationchange even
    window.addEventListener("orientationchange", setOrientation, false);
    window.addEventListener("resize", setOrientation, false);
    
    $(document).bind("allstatisticcalculationsdone", function() {
    	self.controller.transitionToStatistics();
    });
}

CoursesListView.prototype.handleTap = doNothing;
CoursesListView.prototype.handleSwipe = doNothing;

CoursesListView.prototype.handlePinch = function(){
    this.controller.transitionToSettings();
};

CoursesListView.prototype.openDiv = openView;
CoursesListView.prototype.open = function() {
	console.log("open course list view");
	this.active = true;
	this.update();
	this.firstLoad = false;
	this.openDiv();
	this.setIconSize();
};
CoursesListView.prototype.closeDiv = closeView;
CoursesListView.prototype.close = function() {
	console.log("close course list view");
	this.active = false;
	this.closeDiv();
	$("#coursesList").empty();
};

CoursesListView.prototype.clickCourseItem = function(course_id) {
	if (this.controller.models['course'].isSynchronized(course_id)) {
		this.controller.models['questionpool'].reset();
		this.controller.models['questionpool'].loadData(course_id);
		
		this.controller.models['answers'].setCurrentCourseId(course_id);
		this.controller.transitionToQuestion();
	}
};

CoursesListView.prototype.clickSettingsButton = function() {
	this.controller.transitionToSettings();
};

CoursesListView.prototype.clickStatisticsIcon = function(courseID) {
	console.log("statistics button clicked");
	
	if ($("#courseListIcon"+courseID).hasClass("icon-bars")) {
		$("#courseListIcon"+courseID).addClass("icon-loading").removeClass("icon-bars");
	
		//all calculations are done based on the course id and are triggered
		//within setCurrentCourseId
		this.controller.models['statistics'].setCurrentCourseId(courseID);
	}
};

CoursesListView.prototype.update = function() {
	var self = this;

	var courseModel = self.controller.models['course'];
	var statisticsModel = self.controller.models['statistics'];
	courseModel.reset();
	$("#coursesList").empty();

	console.log("First course id: " + courseModel.getId());
	
	if (courseModel.courseList.length == 0) {
		
		var li = $("<li/>", {
		}).appendTo("#coursesList");
		
		$("<div/>", {
			"class": "text",
			text : (self.firstLoad ? "Courses are being loaded" : "No Courses"),
		}).appendTo(li);
		
	} else {
		do {
			var courseID = courseModel.getId();

			var li = $("<li/>", {
				"id" : "course" + courseID,
				
			}).appendTo("#coursesList");

			
			span = $("<div/>", {
				"id":"courseListIcon"+ courseID,
				"class" : "courseListIcon right " + (courseModel.isSynchronized(courseID) ? "icon-bars" : "icon-loading")
			}).appendTo(li);

			
			var mydiv = $("<div/>", {
				
				"class" : "text marginForCourseList",
				text : courseModel.getTitle()
			}).appendTo(li);
			
			jester(mydiv[0]).tap(function() {
				self.clickCourseItem($(this).parent().attr('id').substring(6));
				
			});


			jester(span[0]).tap(
					function(e) {
						self.clickStatisticsIcon($(this).parent().attr('id')
								.substring(6));
						e.stopPropagation();
					});

			
		} while (courseModel.nextCourse());
		self.setIconSize();
	}
};

CoursesListView.prototype.courseIsLoaded = function(courseId) {
	console.log("courseIsLoaded: " + courseId);
	console.log("selector length: "
			+ $("#course" + courseId + " .icon-loading").length);
	$("#course" + courseId + " .icon-loading").addClass("icon-bars")
			.removeClass("icon-loading");
};

CoursesListView.prototype.setIconSize = function() {
	$("#coursesList li").each(function() {
		height = $(this).height();
		$(this).find(".courseListIcon").height(height);
		$(this).find(".courseListIcon").css("line-height", height + "px");
	});
};