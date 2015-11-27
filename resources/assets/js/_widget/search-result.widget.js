define('C.search-result.widget', function() {
	
	var Model = Backbone.Model.extend({
		initialize: function(opt) {
			this.collection = new Backbone.Collection(opt.blocks);
		},
		getNewItems: function() {
			var page = this.get('page') + 1;
			$.ajax({
                method: "POST",
                url: "/AjaxModules/search",
                data: {
                	page: page
                },
                dataType: 'json',
                headers: { 'X-CSRF-Token' : $('meta[name=_token]').attr('content') },
                context: this
            }).done(function(data) {
                var data = JSON.parse(data);
                
                console.log(data);

            }).fail(function() {
                console.log("Connection failed");
            }).always(function() {
            	//do stuff
            });
		},
		getItems: function() {
			return _.clone(this.collection.models);
		}
	});
	
	var View = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this, 'onResize', 'render');

			this.model.on('change:columnSize', this.render);
			window.addEventListener('resize', this.onResize, true);

			this.onResize();
		},
		render: function() {
			var columnSize = this.model.get('columnSize');
			var items = this.model.getItems();
			var counter = 0;

			this.$el.empty();
			
			for (var i = 0; i < columnSize; i++) {
				this.$el.append(this._columnTpl({
					'number': i
				}));
			};
			
			_.each(items, function(value) {
				var oneItem = this._itemTpl(value.attributes);
				this.$('.column-wrapper').eq(counter).append(oneItem);
				
				counter = counter + 1;
				if (counter === columnSize) {
					counter = 0;
				};
			}.bind(this));
		},
		onResize: function(e) {
			var cellSize = this.model.get('cellSize');
			var columnSize = Math.floor(this.$el.width() / cellSize);
			if (columnSize !== this.model.get('columnSize')) {
				this.model.set('columnSize', columnSize);
			};
		},
		_itemTpl: _.template(
			'<div class="one-item-wrapper">' +
				'<div class="img-box">' +
					'<img src="<%- pictureUrl%>" alt="">' +
				'</div>' +
				'<h3 class="item-title"><%- name%></h3>' +
				'<div class="descr-wrapper"><%- shortDescription%></div>' +
			'</div>'
		),
		_columnTpl: _.template(
			'<div class="column-wrapper column-<%-number%>"></div>'
		)
	});

	return function searchResult(opt) {
		var opt = opt || {};
		var blocks = opt.blocks || {};

		var buildComponent = _.extend({
			el: '.search-inner-box',
			model: new Model({
				'cellSize': 280,
				'columnSize': 0,
				'page': 1,
				'blocks': blocks
			}),
			events: {}
		}, opt);

		return new View(buildComponent);
	}

});