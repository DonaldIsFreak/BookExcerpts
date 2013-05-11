(function() {
	 /*
	 * BaseTestCase class
	 */
	function BaseTestCase(name) {
		this.name = name;
		this.func = [];
	}

	/*
	 * Append the test funciton into the array.
	 */
	BaseTestCase.prototype.addTest = function(testFunc) {
		this.func.push(testFunc);
	};

	/*
	 * Run the each test function.
	 */
	BaseTestCase.prototype.run = function() {
		$.each(this.func, function(i, obj) {
			asyncTest(this.name,obj.expected, obj.func);
		});
	};

	function BaseTestCaseSuite() {
		this.tests = [];
	}

	/*Catch the name from the url . Ex. http://localhost/example/#about => about*/
	BaseTestCaseSuite.prototype.getUrl=function() {
			return window.location.hash;
	};

	/*Search by name that the BaseTestCase object of array.*/
	BaseTestCaseSuite.prototype.getBaseTestCase = function(name) {
		var result = null;
		if (this.tests.length >= 1) {
			$.each(this.tests, function(i, baseTestCase) {
				if (baseTestCase.name == name) {
					result = baseTestCase;
				}
			});
		}
		return result;
	};

	/*Append the test function into the BaseTestCase instance.*/
	BaseTestCaseSuite.prototype.add = function(name, funcs) {
		var obj = this.getBaseTestCase(name);
		if (obj === null) {
			obj = new BaseTestCase(name);
			this.tests.push(obj);
		}
		if ($.isArray(funcs)) {
			$.each(funcs, function(i, func) {
				obj.addTest(func);
			});
		} else if ($.isFunction(funcs)) {
			obj.addTest(funcs);
		}
	};

	/* Run the test case depend on the url.*/
	BaseTestCaseSuite.prototype.run = function() {
		var obj = this.getBaseTestCase(this.getUrl());
		if (obj !== null)
			obj.run();
	};

	window.BaseTestCaseSuite = BaseTestCaseSuite;
})();

var suite = new BaseTestCaseSuite();

suite.add('#test', [ 
	{
		expected	: 1,
		func	: function() {
			ok(suite.getUrl() == '#test',"The hash of url is #test.");
			start();
			}
	}, 
	{	
		expected	:5,
		func		:function() {
			var book = new Book();
			var isbn = String.fromCharCode( 65+_.random(0,24))+$.now(),
			title = (new Array("English Book","中文書"))[_.random(0,2)],author="Donald",publisher="Nobody",publish_date=$.now();
			book.isbn = isbn;
			book.title = title;
			book.author = author;
			book.publisher = publisher;
			book.publish_date = publish_date;
			function sucess(obj){
				ok(obj.get("isbn")===isbn,"Same ISBN");
				ok(obj.get("title")===title,"Same Title");
				ok(obj.get("author")===author,"Same Author");
				ok(obj.get("publisher")===publisher,"Same Publisher");
				ok(obj.get("publish_date")===publish_date,"Same Publish Date");
				start();
			}
			book.Save(
				sucess,
				function(obj){
					
				}
			);
		} 
	},
	{
		expected		: 2,
		func			: function(){
			var book = new Book();
			function success(obj){
				ok(obj.length === 1,"Catch only one record");
				ok(obj[0].get("isbn")==="ABC123","Fetch BOOK. ISBN:ABC123");
				console.log(obj[0].existed());
				start();
			}
			book.Fetch("ABC123",success,function(){});
		}
	}
]);

suite.run();