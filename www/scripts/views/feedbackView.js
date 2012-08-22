function FeedbackView(question) {
	var self = this;

	self.tagID = 'cardFeedbackView';

	jester($('#FeedbackDoneButon')[0]).tap(function() {
		self.clickFeedbackDoneButton();
	});
	jester($('#FeedbackMore')[0]).tap(function() {
		self.clickFeedbackMore();
	});

}

FeedbackView.prototype.handleTap = doNothing;
FeedbackView.prototype.handleSwipe = function handleSwipe() {
	$("#feedbackBody").show();
	$("#feedbackTip").hide();
	controller.models['questionpool'].nextQuestion();
	controller.transitionToQuestion();
};

FeedbackView.prototype.handlePinch = function() {
	controller.transitionToCourses();
};

FeedbackView.prototype.closeDiv = closeView;
FeedbackView.prototype.close = function(){
controller.models["answers"].deleteData();
this.closeDiv();
	
};
FeedbackView.prototype.openDiv = openView;
FeedbackView.prototype.open = function() {
	this.showFeedbackTitle();
	this.showFeedbackBody();
	this.openDiv();
};

FeedbackView.prototype.clickFeedbackDoneButton = function() {
	$("#feedbackBody").show();
	$("#feedbackTip").hide();		
	controller.models['questionpool'].nextQuestion();
	controller.transitionToQuestion();
};

FeedbackView.prototype.clickFeedbackMore = function() {
	$("#feedbackBody").toggle();
	$("#feedbackTip").toggle();
};

FeedbackView.prototype.showFeedbackTitle = function() {
	var currentFeedbackTitle = controller.models["answers"].getAnswerResults();
	$("#cardFeedbackTitle").text(currentFeedbackTitle);

	if (currentFeedbackTitle == "Wrong") {
		$("#cardFeedbackIcon i").removeClass("icon-ok-sign");
		$("#cardFeedbackIcon i").removeClass("icon-ok-circle");
		$("#cardFeedbackIcon i").addClass("icon-remove-circle");
	} else if (currentFeedbackTitle == "Partially Correct") {
		$("#cardFeedbackIcon i").removeClass("icon-remove-circle");
		$("#cardFeedbackIcon i").removeClass("icon-ok-sign");
		$("#cardFeedbackIcon i").addClass("icon-ok-circle");
	} else {
		$("#cardFeedbackIcon i").removeClass("icon-remove-circle");
		$("#cardFeedbackIcon i").removeClass("icon-ok-circle");
		$("#cardFeedbackIcon i").addClass("icon-ok-sign");
	}

};

FeedbackView.prototype.showFeedbackBody = function() {

//	$("#feedbackBody").empty();
//	$("#feedbackTip").empty();
//
//	var clone = $("#cardAnswerBody").clone();
//	clone.appendTo("#feedbackBody");
//
//	var questionpoolModel = controller.models["questionpool"];
//
//	$("#feedbackBody ul li").each(function(index) {
//		if (questionpoolModel.getScore(index) == "1") {
//			$(this).addClass("correctAnswer");
//		}
//	});
//
//	var currentFeedbackTitle = controller.models["answers"].getAnswerResults();
//	if (currentFeedbackTitle == "Excellent") {
//		var correctText = questionpoolModel.getCorrectFeedback();
//		if (correctText.length > 0) {
//			$("#FeedbackMore").show();
//			$("#feedbackTip").text(correctText);
//		} else {
//			$("#FeedbackMore").hide();
//		}
//	} else
//
//	{
//		var wrongText = questionpoolModel.getWrongFeedback();
//		console.log(wrongText);
//		if (wrongText.length > 0) {
//			$("#FeedbackMore").show();
//			$("#feedbackTip").text(wrongText);
//		} else {
//			$("#FeedbackMore").hide();
//		}
//		
//	}

	var questionpoolModel = controller.models['questionpool'];
	var questionType = questionpoolModel.getQuestionType();
	var interactive = false;
	switch (questionType) {
		case 'Single Choice Question': 
			this.widget = new SingleChoiceWidget(interactive);
			break;
		case 'Multiple Choice Question': 
			this.widget = new MultipleChoiceWidget(interactive);
			break;
		case 'Text Sort Question':
			this.widget = new TextSortWidget(interactive);
			break;
	// ...
		default:
			break;
	}
	
};

