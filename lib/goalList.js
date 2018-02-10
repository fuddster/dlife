/* @flow */
(function() {
  var GoalList = (function() {
    var GoalList = function() {
      this.goals = [];
    };

    // List of goals
    GoalList.prototype.goals = [];

    GoalList.prototype.addGoal = function addGoal(goal) {
      this.goals.push(goal);
    };

    GoalList.prototype.goalsComplete = function goalsComplete(hist) {
      console.log('goalsComplete() - this = ' + this.constructor.name);
      for (var i = 0; i < this.goals.length; i++) {
        console.log('goal name = ' + this.goals[i].name);
        if (!this.goals[i].func(hist)) {
          console.log('Goals not complete');
          return false;
        }
      }

      console.log('Goals complete!');
      return true;
    };

    GoalList.prototype.goalsList = function goalsList() {
      console.log('goalsList() - this = ' + this.constructor.name);
      for (var i = 0; i < this.goals.length; i++) {
        console.log(this.goals[i]);
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
