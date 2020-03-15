window.onload = () => {
    $.get('/data', (data, status) => {
        var modelData=data;
        var counter;
        var time = 30;
        function startTimer(display) {
            var start = Date.now(),
                diff,
                minutes,
                seconds;
            counter = time;
            display.classList.remove("text-danger");
            display.classList.add("text-success");
            var resetTimer = true;
            function timer() {
                // get the number of seconds that have elapsed since 
                // startTimer() was called
                if (counter < 0) {
                    return;
                }
                diff = time - (((Date.now() - start) / 1000) | 0);
                restTimer = false;

                // does the same job as parseInt truncates the float
                minutes = (diff / 60) | 0;
                seconds = (diff % 60) | 0;

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = minutes + ":" + seconds;
                display.classList.remove("text-danger");
                display.classList.add("text-success")
                if (diff <= 0) {
                    // add one second so that the count down starts at the full duration
                    // example 05:00 not 04:59
                    start = Date.now() + 1000;
                }
                if (counter-- > 0) {
                    setTimeout(timer, 1000);
                }
                else {
                    display.textContent = "Timeout!!!"
                    display.classList.remove("text-success");
                    display.classList.add("text-danger");
                }

            };
            // we don't want to wait a full second before the timer starts
            timer();
            // var scheduledTimer =setInterval(timer, 1000);
        }

        function stopTimer(duration, display) {
            counter = -1;
            var display = document.querySelector('#timer');
            display.textContent = "....";
            display.classList.remove("text-success");
            display.classList.add("text-danger");
        }

        // $.getJSON("rounds.json", function(data) { 
        //     modelData = data;
        // })
        var observableData = ko.mapping.fromJS(modelData);
        function viewModel() {
            var self = this;
            self.model = observableData;
            // self.teams = ko.observableArray(modelData.Teams);
            // self.currentTeamIndex = ko.observable(modelData.CurrentTeamIndex);
            // // modelData.Teams[self.currentTeamIndex()].Points+=10; 
            self.correctAnswer = function () {
                self.model.Teams()[self.model.CurrentTeamIndex()].Points(
                    self.model.Teams()[self.model.CurrentTeamIndex()].Points() + 10
                )
                self.model.CurrentTeamIndex((self.model.CurrentTeamIndex() + 1) % 8);
                // modelData.CurrentTeamIndex++;
            }

            self.wrongAnswer = function () {
                self.model.Teams()[self.model.CurrentTeamIndex()].Points(
                    self.model.Teams()[self.model.CurrentTeamIndex()].Points() - 5
                )
                self.model.CurrentTeamIndex((self.model.CurrentTeamIndex() + 1) % 8);
                // modelData.CurrentTeamIndex++;
            }

            self.passQuestion = function () {
                stopTimer();
                time = 10;
                self.model.CurrentTeamIndex((self.model.CurrentTeamIndex() + 1) % 8);
                // startTimer(document.querySelector('#timer'));
            }
            self.prevQuestion = function () {

                if (self.model.Rounds()[self.model.CurrentRoundIndex()].CurrentQuestionIndex() > -1)
                    self.model.Rounds()[self.model.CurrentRoundIndex()].CurrentQuestionIndex(self.model.Rounds()[self.model.CurrentRoundIndex()].CurrentQuestionIndex() - 1);

            }
            self.nextQuestion = function () {
                time = 30;
                stopTimer();
                if (self.model.Rounds()[self.model.CurrentRoundIndex()].CurrentQuestionIndex() < self.model.Rounds()[self.model.CurrentRoundIndex()].Questions().length - 1)
                    self.model.Rounds()[self.model.CurrentRoundIndex()].CurrentQuestionIndex(self.model.Rounds()[self.model.CurrentRoundIndex()].CurrentQuestionIndex() + 1);
            }
            self.prevTeam = function () {

                if (self.model.CurrentTeamIndex() == 0) { self.model.CurrentTeamIndex(7) }
                else
                    self.model.CurrentTeamIndex((self.model.CurrentTeamIndex() - 1) % 8);

            }
            self.nextTeam = function () {
                self.model.CurrentTeamIndex((self.model.CurrentTeamIndex() + 1) % 8);
            }
            self.prevRound = function () {

                if (self.model.CurrentRoundIndex() > 0)
                    self.model.CurrentRoundIndex((self.model.CurrentRoundIndex() - 1));

            }
            self.nextRound = function () {
                if (self.model.CurrentRoundIndex() < self.model.Rounds().length - 1)
                    self.model.CurrentRoundIndex((self.model.CurrentRoundIndex() + 1));
            }
            self.incMark = function () {
                self.model.Teams()[self.model.CurrentTeamIndex()].Points(
                    self.model.Teams()[self.model.CurrentTeamIndex()].Points() + 1
                )

            }

            self.decMark = function () {
                self.model.Teams()[self.model.CurrentTeamIndex()].Points(
                    self.model.Teams()[self.model.CurrentTeamIndex()].Points() - 1
                )

            }
            self.timer = function () {
                display = document.querySelector('#timer');
                startTimer(display);
            }
        };

        ko.applyBindings(new viewModel());

        // function timer() {
        //     var duration = 10,
        //         display = document.querySelector('#timer');

        //     startTimer(duration, display);
        // };
    })
}

