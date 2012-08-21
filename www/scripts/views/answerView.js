function AnswerView() {
	var self = this;

	self.tagID = 'cardAnswerView';

	self.widget = null;

	jester($('#doneButton')[0]).tap(function() {
		self.clickDoneButton();
	});
	jester($('#CourseList_FromAnswer')[0]).tap(function() {
		self.clickCourseListButton();
	});

	jester($('#cardAnswerTitle')[0]).tap(function() {
		self.clickTitleArea();
		console.log("answer title clicked");
	});
	jester($('#cardAnswerIcon')[0]).tap(function() {
		self.clickTitleArea();
		console.log("answer title clicked");
	});

}

AnswerView.prototype.handleTap = doNothing;
AnswerView.prototype.handlePinch = function() {
	controller.transitionToCourses();
};

AnswerView.prototype.handleSwipe = function() {

	controller.models["answers"].deleteData();

	controller.models['questionpool'].nextQuestion();
	controller.transitionToQuestion();
};

AnswerView.prototype.close = closeView;
AnswerView.prototype.openDiv = openView;
AnswerView.prototype.open = function() {

	this.showAnswerTitle();
	this.showAnswerBody();
	this.openDiv();

};

AnswerView.prototype.showAnswerBody = function() {

	$("#dataErrorMessage").empty();
	$("#cardAnswerBody").empty();
	
	var questionpoolModel = controller.models['questionpool'];

	if (questionpoolModel.getAnswer()[0].text) {

		var questionType = questionpoolModel.getQuestionType();
		var interactive = true;
		switch (questionType) {
		case 'Single Choice Question':
			this.widget = new SingleChoiceWidget(interactive);
			break;
		case 'Multiple Choice Question':
			this.widget = new MultipleChoiceWidget(interactive);
			break;
		default:
			break;
		}

	} else {
		$("<span/>", {
			text : "Apologize, no data are loaded"
		}).appendTo($("#dataErrorMessage"));
	}
};

AnswerView.prototype.showAnswerTitle = function() {
	var currentAnswerTitle = controller.models["questionpool"]
			.getQuestionType();
	$("#cardAnswerTitle").text(currentAnswerTitle);
};

AnswerView.prototype.clickDoneButton = function() {

	if (controller.models['questionpool'].getAnswer()[0].text) {
		this.widget.storeAnswers();
		controller.transitionToFeedback();
	} else {

		controller.models['questionpool'].nextQuestion();
		controller.transitionToQuestion();

	}

};

AnswerView.prototype.clickCourseListButton = function() {

	controller.transitionToCourses();

};

AnswerView.prototype.clickTitleArea = function() {

	this.widget.storeAnswers();
	controller.transitionToQuestion();

};
