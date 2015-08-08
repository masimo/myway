(function() {
    var Model = Backbone.Model.extend({
        initialize: function(options) {
            //
        },
        getSuggestions: function(query) {
            var that = this;
            
            $.ajax({
                method: "GET",
                url: "/AjaxModules/suggestions",
                //data: { name: "John", location: "Boston" },
                dataType: 'json'
            }).done(function(data) {
                that.set('suggestion', JSON.parse(data));
            }).fail(function() {
                console.log("Connection failed");
            }).always(function() {
                //do nothing
            });
        }
    });

    var View = Backbone.View.extend({
        initialize: function() {
            this.model = new Model();
            this.model.on('change', this.render, this);
            this.model.getSuggestions();
        },
        render: function() {
            console.log(this.model.get('suggestion'));
        }
    });

    return new View;
})();