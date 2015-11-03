define('C.drop-down.widget', function() {

    var SerachCriteria = Backbone.Collection.extend({
        initialize: function() {
            //
        }
    });
    var Model = Backbone.Model.extend({
        
        defaultQuery: {
            "criteria": "", //  - required
            "page": 1, // - not required default 1
            "limit": 6 // - not required default 6
        },
        initialize: function(options) {
            this.on('set_cell_active', this.setCell, this);
            this.on('change:searchField', this.getSuggestions, this);
            this.on('select_item', this.setItemToActiveState, this);
            this.on('add_item_to_criteria', this.addItemToCriteria, this);
            this.on('submit', this.getSearchResults, this);

            this.search = new SerachCriteria;

            this.set('active', false);
            this.set('loading', false);
            //
        },
        getSuggestions: function(query) {
            var postData = _.extend({"criteria": this.get('searchField')}, this.defaultQuery);
            this.set('loading', true);
            $.ajax({
                method: "POST",
                url: "/AjaxModules/suggestions",
                data: postData,
                dataType: 'json',
                headers: { 'X-CSRF-Token' : $('meta[name=_token]').attr('content') },
                context: this
            }).done(function(data) {
                var data = JSON.parse(data);
                var suggestionList = [];

                this.set('active', true);

                for (var i = 0; i < data.criterias.length; i++) {
                    suggestionList.push(_.extend(data.criterias[i],{active:false}));
                };  
                
                this.set('suggestion', suggestionList);
                this.trigger("change_suggestion");

            }).fail(function() {
                this.set('active', false);
                console.log("Connection failed");
            }).always(function() {
                this.set('loading', false);
            });
        },
        getSearchResults: function() {
            var that = this;
            var postData = [];
            _.collect(this.search.models, function(model, key, sads) {
                postData.push(model.get('id'));
            });
            var query = $.param({
                q: postData
            });
            if (query) {
                document.location.href = '/search/myway/?' + query;
            };
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

            // model events
            this.model.on('change_suggestion', this.render, this);
            this.model.on('change:active', this.widgedCondition, this);
            this.model.on('change:loading', this.loadingCondition, this);
            this.model.on('added_to_search_field', function() {
                this.getSuggestionWidget().trigger('clear_fields');                
            }.bind(this));

            this.getSuggestionWidget()
                .on('clicked_item', function(payload) {
                    this.model.trigger('select_item', payload);
                }.bind(this));

        },
        
        render: function() {
            this.getSuggestionWidget().trigger('render', this.model.get('suggestion'));
        },

        widgedCondition: function() {
            this.getSuggestionWidget().trigger('changeStatus', this.model.get('active'));
        },

        loadingCondition: function() {
            this.getSuggestionWidget().trigger('loading', this.model.get('loading'));
        },

       
        getSuggestionWidget: function() {
            if (this.dropDownSuggestion === null) {

                var el = $('<div class="dropdown-wrapper"></div>');
                this.$el.append(el);

                this.dropDownSuggestion = new DropDownWidget({
                    el: el,
                    inputTarget: $('.search-field')
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
            this.model.trigger('submit');
        },
        setStatus: function(status) {
            var status = status && status.hasOwnProperty('type') ? false : status || false;

            this.model.set('active', status);

        }
    });
    
    var DropDownWidget = Backbone.View.extend({
        initialize:function(options) {
            this.$el = options.el;
            this.$inputTarget = options.inputTarget;

            //events
            this.on('render', this.render, this);
            this.on('changeStatus', this.changeStatus, this);
            this.on('loading', this.loadingProgress, this);
            this.on('clear_fields', function() {
                this.trigger('changeStatus', false);
                options.inputTarget.val('');
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
            var position = this.offsetPosition(this.$inputTarget.get(0));
                width = this.$inputTarget.width();
            //Set position of drop down on render
            this.$el.css({
                top: position.top + this.$inputTarget.outerHeight(),
                left: position.left,
                width: this.$inputTarget.outerWidth()
            });

            this.$el.empty().append(this._tpl({
                dirrectionClass: '',
                items: suggestions
            }));
        },
        offsetPosition: function(obj) {
            var curleft = curtop = 0;
            
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            
            return {
                'left': curleft,
                'top': curtop
            };
        },
        loadingProgress: function(status) {
            if (status) {
                this.$inputTarget.addClass('loading-active');
            } else {
                this.$inputTarget.removeClass('loading-active');
            }
        },
        changeStatus: function(status) {
            if (status) {
                this.$el.show();
                this.$inputTarget.addClass('drop-down-active');
            } else {
                this.$el.hide();    
                this.$inputTarget.removeClass('drop-down-active');
            }
        },
        activateCell: function(e) {
            var id = $(e.target).attr('data-id');
            this.trigger('clicked_item', id);
        }
    });
    
    return function dropDown(opt) {
        var buildComponent = _.extend(opt, {
            el: 'body',
            events: {
                "keydown": "keyAction",
                "keyup .search-field": "searchFieldAction",
                "click .submit-search": "showResult",
                "click": "setStatus"
            }
        });
        return new View(buildComponent);
    }
});
