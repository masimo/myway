require(['C.drop-down.widget'], function(dropDown) {
	var View = Backbone.View.extend({
		initialize: function() {
			this.dropDown = dropDown();
		}
	})
	return new View();
});