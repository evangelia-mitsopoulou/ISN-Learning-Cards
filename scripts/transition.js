var transitionsLoaded = false;

function createCourseList() {
	for (var c in courses) {
		$("#coursesList").append(
				"<li class='listItem' id='course" + courses[c].getId() + "'>" + courses[c].getTitle()
						+ "<span class='span1'></li>"); //addClass - removeClass
                        
                        
		
		// from course list view to card question view by tapping on a
		// list item
		jester($("#course" + courses[c].getId())[0]).tap(function() {
			currentCourse = getCourse($(this).attr('id').substring(6));
			currentCourse.nextQuestion();
			$("#cardQuestionView p").text(currentCourse.getCurrentQuestion());
			$("#cardQuestionView").show();
			$("#coursesListView").hide();
			$("#splashScreen").hide();

		});
		
	}
}

function loadTransitions() {

    transitionsLoaded = true;

	// //from splash screen to login by tapping
	//  
	// jester($("#splashScreen")[0]).tap(function(){
	// $("#loading").toggle();
	// $("#loginForm").toggle();
	// });

	// from login view to course list by tapping on the login button
	jester($("#loginButton")[0]).tap(
			function() {
				configurationModel.loginState = "loggedIn";
				localStorage.configuration = JSON.stringify(configurationModel);
				localStorage.courses = JSON.stringify(courses);
				
				createCourseList();
				
				$("#coursesListView").show();
				$("#loginForm").hide();
				$("#splashScreen").hide();
			});
	
	// from course list view to settings view by swiping (it should be
	// done by pinching)
	jester($("#coursesList")[0]).swipe(function() {
		$("#settingsView").show();
		$("#coursesListView").hide();
		$("#splashScreen").hide();

	});
	
	// from course list view to settings view by button (it should be
	// done by pinching)
	jester($("#coursesListSetIcon")[0]).tap(function() {
		$("#settingsView").show();
		$("#coursesListView").hide();
		$("#splashScreen").hide();

	});

	// from settings to course list by taping on the close button
	jester($("#closeSettings")[0]).tap(function() {
		$("#settingsView").hide();
		$("#coursesListView").toggle();
		$("#splashScreen").hide();

	});

	// from settings to course list by swipping (it should be done by
	// stretching)
	jester($("#settingsView")[0]).swipe(function() {
		$("#settingsView").hide();
		$("#coursesListView").toggle();
		$("#splashScreen").hide();

	});

	// from settings to confirmation screen by clicking on the logout
	// button, the same result sould be obtained by pinching)
	jester($("#logOutSettings")[0]).tap(function() {
		$("#settingsView").hide();
		$("#logoutConfirmationView").toggle();
		$("#splashScreen").hide();

	});

	// from logouts confirmation screen to settings by swiping. the same
	// result should be obtained by pinching and stretching
	jester($("#logoutConfirmationView")[0]).swipe(function() {
		$("#logoutConfirmationView").hide();
		$("#settingsView").show();
		$("#splashScreen").hide();

	});

	// from logout confirmation screen to splash screen by taping on the
	// logout button (the final one)
	jester($("#logOut")[0]).tap(function() {
		//$("#splashScreen").show();
		//$("#loading").show();
		configurationModel.loginState = "loggedOut";
		console.log("before storing");
		localStorage.configuration = JSON.stringify(configurationModel);
		localStorage.courses = JSON.stringify(courses);
		console.log("after storing");
		//window.close();
        $("#logoutConfirmationView").hide();
        $("#loading").show();
        $("#splashScreen").show();
        start();
	});

	// from card question view 1 to next one by swiping (in the future
	// to implement this by an algorithm ..based on the weight of each
	// learning card

	jester($("#cardQuestionView")[0]).swipe(function() {
//		$("#cardQuestionView1").hide();
//		$("#cardQuestionView2").toggle();
//		$("#splashScreen").hide();
		currentCourse.nextQuestion();
		$("#cardQuestionView p").text(currentCourse.getCurrentQuestion());

	});

	// from card question view to answer view by tapping anywhere on the
	// screen
	jester($("#cardQuestionView")[0]).tap(function() {
		$("#cardQuestionView").hide();
		$("#cardAnswerView p").text("Answer 1: " + currentCourse.getAnswer());
		$("#cardAnswerView").show();
//		$("#splashScreen").hide();

	});

    // from card question view to answer view by tapping anywhere on the
	// screen
	jester($("#ButtonAnswer")[0]).tap(function() {
		$("#cardQuestionView").hide();
		$("#cardAnswerView p").text("Answer 1: " + currentCourse.getAnswer());
		$("#cardAnswerView").show();
//		$("#splashScreen").hide();

	});

	// from card question view to course list by tapping on the course
	// list view button. It should be done by pinching
	jester($("#CourseList_FromQuestion")[0]).tap(function() {
		$("#cardQuestionView").hide();
		$("#cardAnswerView").hide();
		$("#coursesListView").show();
//		$("#cardQuestionView1").hide();
//		$("#courseList").toggle();
//		$("#splashScreen").hide();

	});

	jester($("#cardAnswerView")[0]).swipe(function() {
		$("#cardAnswerView").hide();
		currentCourse.nextQuestion();
		$("#cardQuestionView p").text(currentCourse.getCurrentQuestion());
		$("#cardQuestionView").show();
//		$("#splashScreen").hide();

	});

	// from card answer view to question view by tapping on the title
	// area of it
	jester($("#titleAnswer")[0]).tap(function() {
		$("#cardAnswerView").hide();
		$("#cardQuestionView").show();
//		$("#splashScreen").hide();

	});

	// tap on done button in answer view page so that to navigate to
	// feedback view
	jester($("#done")[0]).tap(function() {
		$("#cardAnswerView").hide();
		$("#cardFeedbackView p").text(currentCourse.getFeedback());
		$("#cardFeedbackView").show();
//		$("#splashScreen").hide();

	});
	
	// tap anywhere in answer view page so that to navigate to
	// feedback view
	jester($("#cardAnswerView")[0]).tap(function() {
		$("#cardAnswerView").hide();
		$("#cardFeedbackView p").text(currentCourse.getFeedback());
		$("#cardFeedbackView").show();
//		$("#splashScreen").hide();

	});

	// to do the navigation from card answer view to course list view by
	// pinching

	// code

	// from feedback view to question view by swiping
	jester($("#cardFeedbackView")[0]).swipe(function() {
		console.log("Feedback swipe");
		$("#cardFeedbackView").hide();
		currentCourse.nextQuestion();
		$("#cardQuestionView p").text(currentCourse.getCurrentQuestion());
		$("#cardQuestionView").show();
//		$("#splashScreen").hide();

	});
	
	// from feedback view to question view by tap
	jester($("#cardFeedbackView")[0]).tap(function() {
		console.log("Feedback tap");
		$("#cardFeedbackView").hide();
		currentCourse.nextQuestion();
		$("#cardQuestionView p").text(currentCourse.getCurrentQuestion());
		$("#cardQuestionView").show();
//		$("#splashScreen").hide();

	});

	// to do the navigation from feedback view to course list view by
	// pinching

	
	
}