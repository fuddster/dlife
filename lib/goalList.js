/* @flow */
(function() {
  var GoalList = (function() {
    var GoalList = function() {
      this.goals = [];
    };

    // List of goals
    GoalList.prototype.goals = [];

    GoalList.prototype.addGoal = function addGoal(goal) {
      goals.push(goal);
    };

    GoalList.prototype.goalsComplete = function goalsComplete(hist) {
      console.log('goalsComplete() - this = ' + this.constructor.name);
      for (var i = 0; i < goals.length; i++) {
        console.log('goal name = ' + goals[i].name);
        if (!goals[i].func(hist)) {
          return false;
        }
      }

      return true;
    };

    GoalList.prototype.goalsList = function goalsList() {
      console.log('goalsList() - this = ' + this.constructor.name);
      for (var i = 0; i < goals.length; i++) {
        console.log(goals[i]);
      }
    };

    return GoalList;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = GoalList;
  } else {
    window.GoalList = GoalList;
  }
})();
