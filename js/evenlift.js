var evenliftRef = new Firebase('https://evenlift.firebaseio.com');
var currentUserRef = null;
var currentWorkoutRef = null;
var setsRef = null;

var auth = new FirebaseSimpleLogin(evenliftRef, function(error, user) {
  if (user) {
    currentUserRef = evenliftRef.child('users/'+user.uid);
    // user logged in
    startWorkout();
  } else {
    // user is logged out
    showLogin();
    if (error) {
      // an error occurred while attempting login
      alert(error);
    }
  }
});

// Logout the user whenever we get to this page
auth.logout();

function startWorkout() {
  $('#spinner').hide();
  $('#login').hide();
  $('#add').show();

  var userWorkoutsRef = currentUserRef.child('workouts');

  // Create new workout object
  currentWorkoutRef = userWorkoutsRef.push();

  // Set currentWorkoutRef's start_time to $.now()
  currentWorkoutRef.child('start_time').set($.now());

  setsRef = currentWorkoutRef.child('sets');
}

function showLogin() {
  $('#spinner').hide();
  $('#password').val('');
  $('#login').show();
  $('#add').hide();
}

function attemptLogin() {
  $('#spinner').show();
  $('#login').hide();
  var email = $('#email').val();
  var password = $('#password').val();
  auth.login('password', { email: email, password: password });
};

$('#password').keypress(function (e) {
  if (e.keyCode == 13) {
    attemptLogin();
  }
});

function submitSet() {
  var set = { exercise: $('#exercise').val(), reps: $('#reps').val(), weight: $('#weight').val(), rest: $('#rest').val(), notes: $('#notes').val(), time: $.now() };

  setsRef.push(set);
}

function endWorkout() {
  auth.logout();

  // Set currentWorkoutRef's end_time to $.now()
  currentWorkoutRef.child('end_time').set($.now());
}