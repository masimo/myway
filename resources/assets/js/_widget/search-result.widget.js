define('C.search-result.widget', function(){
	var Model = Backbone.Model.extend({
		initialize: function(){
			
		}
	});
	var View = Backbone.View.extend({
		initialize: function(){

		}
	});
	return function searchResult(opt){
		var opt = opt || {};

        var buildComponent = _.extend({
            el: 'body',
            model: new Model(),
            events: {}
        }, opt);
        
        return new View(buildComponent);
	} 

});