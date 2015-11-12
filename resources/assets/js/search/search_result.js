require(['C.drop-down.widget', 'C.search-result.widget', 'C.global'], function(dropDown, showResult, global) {

	var View = Backbone.View.extend({
		initialize: function() {
			var options = {};
			options = global();
			this.showResult = showResult(options);
			this.dropDown = dropDown();
		}
	});
	return new View();
});