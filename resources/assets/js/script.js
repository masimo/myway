(function() {
    var SerachCriteria = Backbone.Collection.extend({
        initialize: function() {
            //
        }
    });
    var Model = Backbone.Model.extend({
        
        defaultQuery: {
            "criteria": "", // "замоk",  - required
            "page": 1, // - not required default 1
            "limit": 6 // - not required default 6
        },
        initialize: function(options) {
            this.on('set_cell_active', this.setCell, this);
            this.on('change:searchField', this.getSuggestions, this);
            this.on('select_item', this.setItemToActiveState, this);
            this.on('add_item_to_criteria', this.addItemToCriteria, this);

            this.search = new SerachCriteria;

            this.set('active', false);
            //
        },
        getSuggestions: function(query) {
            var that = this;
            var postData = _.extend({"criteria": this.get('searchField')}, this.defaultQuery);
            $.ajax({
                method: "POST",
                url: "/AjaxModules/suggestions",
                data: postData,
                dataType: 'json',
                headers: { 'X-CSRF-Token' : $('meta[name=_token]').attr('content') }
            }).done(function(data) {
                var data = JSON.parse(data);
                var suggestionList = [];

                that.set('active', true);

                for (var i = 0; i < data.criterias.length; i++) {
                    suggestionList.push(_.extend(data.criterias[i],{active:false}));
                };  
                
                that.set('suggestion', suggestionList);
                that.trigger("change_suggestion");

            }).fail(function() {
                that.set('active', false);
                console.log("Connection failed");
            }).always(function() {
                //do nothing
            });
        },
        setCell: function(action) {
            var currentIndex = this.getActiveIndex();
            var suggestionList = this.get('suggestion');

            if (currentIndex > -1) {
                suggestionList[currentIndex].active = false;
            };

            switch (action) {
                case "next":
                    var index = currentIndex + 1;
                    if (index === suggestionList.length) {
                        index = 0;
                    };
                    break;
                case "previous":
                    var index = currentIndex - 1;
                    if (index === -2 || index === -1) {
                        index = suggestionList.length - 1;
                    };
                    break;
                case "current":
                    
                    break;
            }
     
            suggestionList[index].active = true;
            this.set('suggestion', suggestionList);
            this.trigger("change_suggestion");
        },
        getActiveIndex: function() {
            var index = -1; //not exist
            var suggestionList = this.get('suggestion');
            
            _.find(suggestionList, function(item, key) {
                if (item.active == true) {
                    index = key;
                    return true;
                }
            });

            return index;
        },

        setItemToActiveState: function(payload) {
            var suggestionList = this.get('suggestion');
            var currentIndex = this.getActiveIndex();
            var index = -1;
            _.find(suggestionList, function(item, key) {
                if (item.id == payload) {
                    index = key;
                    return true;
                }
            });
            if (currentIndex > -1) {
                suggestionList[currentIndex].active = false;
            };
            if (index > -1) {
                suggestionList[index].active = true;
                this.set('suggestion', suggestionList);
                this.trigger('add_item_to_criteria');
            };
        },

        addItemToCriteria: function() {
            var currentIndex = this.getActiveIndex();

            this.search.add(this.get('suggestion')[currentIndex]);
            this.trigger('added_to_search_field');
        }
    });

    var View = Backbone.View.extend({
        
        dropDownSuggestion: null,
        
        initialize: function(options) {
            this.$el = $(options.el);
            this.model = new Model;
            this.search = new SerachCriteria;

            // model events
            this.model.on('change_suggestion', this.render, this);
            this.model.on('change:active', this.widgedCondition, this);
            this.model.on('added_to_search_field', function() {
                this.getSuggestionWidget().trigger('clear_fields');                
            }.bind(this));

            this.getSuggestionWidget()
                .on('clicked_item', function(payload) {
                    this.model.trigger('select_item', payload);
                }.bind(this));

        },
        events: {
            "keydown": "keyAction",
            "keyup .search-field": "searchFieldAction",
            "click .submit-search": "showResult",
            "click": "setStatus"

        },
       
        
        render: function() {
            this.getSuggestionWidget().trigger('render', this.model.get('suggestion'));
        },

        widgedCondition: function() {
            this.getSuggestionWidget().trigger('changeStatus', this.model.get('active'));
        },
       
        getSuggestionWidget: function() {
            if (this.dropDownSuggestion === null) {

                var el = $('<div class="dropdown-wrapper"></div>');
                this.$el.append(el);

                this.dropDownSuggestion = new DropDownWidget({
                    el: el,
                    target: $('.search-field')
                });
            };
            return this.dropDownSuggestion;
        },
       
        searchFieldAction: function(e) {
            var value = $(e.target).val().trim();

            if (value.length >= 3 && this.model.get('searchField') !== value) {
                this.model.set('searchField', value);
            }
            if (value.length < 3){
                this.model.set('active', false);   
            }
        },
        keyAction: function(e) {
            var _DOWN = 40,
                _ESC = 27,
                _ENTER = 13,
                _TOP = 38;
            
            if (this.model.get('active')) {
                if (e.keyCode === _TOP) {
                    this.model.trigger('set_cell_active', 'previous');
                }
                if (e.keyCode === _DOWN) {
                    this.model.trigger('set_cell_active', 'next');
                }
                if (e.keyCode === _ESC) {
            
                    this.setStatus();
                }
                if (e.keyCode === _ENTER) {
                    this.model.trigger('add_item_to_criteria');
                    
                }
            }
            //console.log(e.keyCode);
        },
        showResult:function(e) {
            console.log('Go to result page');
        },
        setStatus: function(status) {
            var status = status && status.hasOwnProperty('type') ? false : status || false;

            this.model.set('active', status);

        }
    });
    
    var DropDownWidget = Backbone.View.extend({
        initialize:function(options) {
            this.$el = options.el;

            //events
            this.on('render', this.render, this);
            this.on('changeStatus', this.changeStatus, this);
            this.on('clear_fields', function() {
                this.trigger('changeStatus', false);
                options.target.val('');
            }.bind(this));
        },

        events: {
            'click li.item': 'activateCell'
        },

         _tpl: _.template(
                '<div class="dropdown-inner-box">'+
                    '<ul class="search-direction <%-dirrectionClass%>"></ul>'+
                    '<ul class="suggestion-items">'+
                        '<% if (items.length) {%>'+
                            '<% for (var i = 0; i < items.length; i++) { %>'+
                                '<li class="item <% if (items[i].hasOwnProperty("active") && items[i].active === true) { %>active<% } %>" data-id="<%-items[i].id%>"><%- items[i].name %></li>'+    
                            '<% } %>'+
                        '<%} else {%>'+
                            '<div class="no-items">No results</div>'+
                        '<%}%>'+
                    '</ul>'+
                '</div>'
        ),
        render: function(suggestions) {
            this.$el.empty().append(this._tpl({
                dirrectionClass: '',
                items: suggestions
            }));
        },
        changeStatus: function(status) {
            if (status) {
                this.$el.show();
            } else {
                this.$el.hide();    
            }
        },
        activateCell: function(e) {
            var id = $(e.target).attr('data-id');
            this.trigger('clicked_item', id);
        }
    });

    return new View({el:'body'});
})();
