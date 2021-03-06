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
            this.on('set_cell_active', this.setCell, this)
                .on('change:searchField', this.getSuggestions, this)
                .on('select_item', this.setItemToActiveState, this)
                .on('add_item_to_criteria', this.addItemToCriteria, this)
                .on('submit', this.getSearchResults, this)
                .on('remove_search_item', this.removeSearchItemById, this);


            this.search = new SerachCriteria;

            this.set('active', false);
            this.set('loading', false);
            //
        },
        getSuggestions: function(query) {
            var postData = _.extend(this.defaultQuery, {"criteria": this.get('searchField')});
            this.set('loading', true);
            $.ajax({
                method: "POST",
                url: "/AjaxModules/suggestions",
                data: postData,
                headers: {
                    'X-CSRF-Token': $('meta[name=_token]').attr('content')
                },
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

            }).fail(function(err) {
                console.log(err);
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
            var item = this.get('suggestion')[currentIndex];
            
            this.search.add(item);

            this.trigger('added_to_search_field', _.clone(this.search.models));
        },
        removeSearchItemById: function(id){
            var model = _.filter(_.clone(this.search.models), function(chr){
                return chr.attributes.id === id;
            })[0];
            
            this.search.remove(model.id);

            this.trigger('added_to_search_field', _.clone(this.search.models));
        }
    });

    var View = Backbone.View.extend({
        
        dropDownSuggestion: null,
        
        initialize: function(options) {
            
            // model events
            this.model.on('change_suggestion', this.render, this);
            this.model.on('change:active', this.widgedCondition, this);
            this.model.on('change:loading', this.loadingCondition, this);
            this.model.on('added_to_search_field', function(items) {
                this.getSuggestionWidget().trigger('clear_fields');
                this.renderItemsInField(items);
            }.bind(this));

            this.decodeFromSearchQuery(window.location.search)

            this.getSuggestionWidget()
                .on('clicked_item', function(payload) {
                    this.model.trigger('select_item', payload);
                }.bind(this));

            this.$('input.search-field')
            // event handler
            .keyup(this.resizeInput);
            // resize on page load
            //.each(resizeInput);


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
                $('body').append(el);

                this.dropDownSuggestion = new DropDownWidget({
                    el: el,
                    inputTarget: $('.search-field-wrapper')
                });
            };
            return this.dropDownSuggestion;
        },
        decodeFromSearchQuery: function(uri){
            //$.parseParams(uri);
        },
        renderItemsInField: function(items) {
            var $input = this.$('.search-field');

            // Defaults
            var inputAttr = {
                placeholder: this.model.get('placeholder'),
                size: 20
            };

            this.$('.item').each(function() {
                this.remove();
            });

            // Rewrite default params
            if (items.length) {
                inputAttr = {
                    placeholder: '',
                    size: 1
                }
            };

            _.each(items, function(item) {
                this.$('.search-field-wrapper').append(this._itemTpl(item.attributes));
            }.bind(this));

            $input.attr({
                'placeholder': inputAttr.placeholder,
                'size': inputAttr.size
            });
            this.$('.search-field-wrapper').append($input);
        },

        resizeInput: function() {
            $(this).attr('size', $(this).val().length);
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

        },
        focusField: function(e) {
            var $target = $(e.target);
            if ($target.hasClass('search-field-wrapper')) {
                $target.append(this.$('.search-field'));
                this.$('.search-field').focus();
            };
        },
        removeSearchQuery: function(e){
            var id = $(e.target).closest('.item').data('id');
            this.model.trigger('remove_search_item', id);
        },
        _itemTpl: _.template(
            '<div class="item" data-id="<%- id %>">' +
                '<span class="item-name"><%- name %></span>' +
                '<div class="close-btn"></div>' +
            '</div>'
        )
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
                options.inputTarget.find('.search-field').val('');
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
        var opt = opt || {};

        var buildComponent = _.extend({
            el: '.input-search-box',
            model: new Model({
                placeholder: $('.input-search-box .search-field').attr('placeholder')
            }),
            events: {
                "keydown": "keyAction",
                "keyup .search-field": "searchFieldAction",
                "click .submit-search": "showResult",
                "click body": "setStatus",
                "click .search-field-wrapper": "focusField",
                "click .close-btn": "removeSearchQuery"
            }
        }, opt);
        
        return new View(buildComponent);
    }
});
