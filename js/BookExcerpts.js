$(function() {
	function redir(page, mustLogin, error) {
		var path = window.location;
		var current = window.location.hash;

		if (typeof (error) === 'undefined')
			error = "error";

		if (!mustLogin)
			path.hash = page;
		else if (mustLogin && Parse.User.current())
			path.hash = page;
		else
			path.hash = error;
	}
	Parse.View.prototype.redir = redir;
	Parse.Router.prototype.redir = redir;

	Parse.initialize("EmoukElCI4s21TRoDa5MRPoGM474zKNIetUAonOE",
			"r10av5SDEvpHwQQsL7n1VoWbia4z5AgJuwiFYybl");

	// Model
	function Book(object) {
		if (typeof (object) === "object" && object.className === 'Book') {
			this.instance = object;
			this.isbn = object.get("isbn");
			this.title = object.get("title");
			this.author = object.get("author");
			this.publisher = object.get("publisher");
			this.publish_date = object.get("publish_date");
		} else {
			var ParseBook = Parse.Object.extend("Book");
			this.instance = new ParseBook();
			this.isbn = "";
			this.title = "";
			this.author = "";
			this.publisher = "";
			this.publish_date = "";
			this.id = this.instance.id;
		}
	}

	Book.prototype.Save = function(successFunc, errorFunc) {
		this.instance.set({
			title : this.title,
			author : this.author,
			isbn : this.isbn,
			publisher : this.publisher,
			publish_date : this.publish_date
		});
		this.instance.save(null, {
			success : function(object) {
				successFunc(object);
			},
			error : function(object) {
				errorFunc(object);
			}
		});
	}

	Book.prototype.Fetch = function(isbn, successFunc, errorFunc) {
		var result = false, query = new Parse.Query("Book");
		query.equalTo('isbn', isbn).find({
			success : function(object) {
				successFunc(object);
			},
			error : function(object) {
				errorFunc(object);
			}
		});
	}

	var BookList = Parse.Collection.extend
	// View
	var IndexView = Parse.View.extend({
		el : "#content",

		events : {
			"click #logout-button" : "logout"
		},
		initialize : function() {
			this.redir("index", true, "login");
			this.render();
		},

		logout : function() {
			Parse.User.logOut();
			this.redir("login", false);
		},

		render : function() {
			var user = Parse.User.current();
			if (user)
				this.$el.html(_.template($("#index-template").html(), user
						.toJSON()));
		}
	});

	var LoginView = Parse.View.extend({
		el : "#content",
		events : {
			"click #login-button" : "login"
		},
		initialize : function() {
			this.render();
		},

		login : function() {
			var self = this;
			var username = $("#login-username").val();
			var password = $("#login-password").val();

			Parse.User.logIn(username, password, {
				success : function(user) {
					self.redir("index", "login");
				},
				error : function(user, error) {
					$("#login .error").html(
							"Invalid username or password. Please try again.")
							.show();
				}
			});
		},
		render : function() {
			this.$el.html(_.template($("#login-template").html()));
		}

	});

	var SignupView = Parse.View.extend({
		el : "#content",
		events : {
			"click #signup-button" : "signup"
		},
		initialize : function() {
			this.render();
		},

		signup : function() {
			var self = this;
			var username = $("#signup-username").val();
			var password = $("#signup-password").val();

			Parse.User.signUp(username, password, {
				ACL : new Parse.ACL()
			}, {
				success : function(user) {
					self.redir("index", true, "login");
				},
				error : function(user, error) {
					$("#sign .error").html(error.message).show();
				}
			});
		},
		render : function() {
			this.$el.html(_.template($("#signup-template").html()));
		}
	});

	var ErrorView = Parse.View.extend({
		el : "#content",

		initialize : function(option) {
			this.render();
		},
		render : function() {
			this.$el.html(_.template($("#error-template").html()));
		}
	});

	var TestView = Parse.View.extend({
		el : "#content",

		initialize : function(option) {
			this.render();
		},
		render : function() {
			this.$el.html(_.template($("#test-template").html()));
		}
	});

	// Controller
	var AppRouter = Parse.Router.extend({
		routes : {
			"index" : "index",
			"login" : "login",
			"signup" : "signup",
			"error" : "error",
			"test" : "test"
		},

		initialize : function(options) {
			//this.redir("index",true,"login");
		},

		login : function() {
			new LoginView();
		},
		signup : function() {
			new SignupView();
		},
		index : function() {
			new IndexView();
		},
		error : function() {
			new ErrorView();
		},
		test : function() {
			new TestView();
		}
	});

	new AppRouter();
	window.Book = Book;
	Parse.history.start();
});
