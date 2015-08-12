(function() {
    var Model = Backbone.Model.extend({
        active:false,
        defaultQuery: {
            "criteria": "", // "замоk",  - required
            "page": 1, // - not required default 1
            "limit": 6 // - not required default 6
        },
        initialize: function(options) {
            this.on('set_next', this.setNext, this);
            this.on('set_previous', this.setPrevious, this);
            this.on('get_suggestions', this.getSuggestions, this);
            //
        },
        getSuggestions: function(query) {
            var that = this;
            var data = _.extend({}, this.defaultQuery);
            $.ajax({
                method: "POST",
                url: "/AjaxModules/suggestions",
                data: data,
                dataType: 'json',
                headers: { 'X-CSRF-Token' : $('meta[name=_token]').attr('content') }
            }).done(function(data) {
                var data = JSON.parse(data);
                var suggestionList = [];

                that.trigger('change_status', true);
                
                for (var i = 0; i < data.criterias.length; i++) {
                    suggestionList.push(_.extend(data.criterias[i],{active:false}));
                };  
                console.log(suggestionList);
                that.set('suggestion', suggestionList);

            }).fail(function() {
                that.trigger('change_status', false);
                that.trigger('change');
                console.log("Connection failed");
            }).always(function() {
                //do nothing
            });
        },
        setNext: function() {
            var suggestionList = this.get('suggestion');
            var index = -1; //not exist
            _.find(suggestionList, function(item, key) {
                if (item.active == true) {
                    index = key;
                    return true;
                }
            });

            console.log(index);
            // suggestionList[index].active = true;
            // that.set('suggestion', suggestionList);
        },
        setPrevious: function() {
            var index = -1; //not exist
            var suggestionList = this.get('suggestion');
            
            _.find(suggestionList, function(item, key) {
                if (item.active == true) {
                    index = key;
                    return true;
                }
            });
            
            console.log(index);
            // suggestionList[index].active = true;
            // that.set('suggestion', suggestionList);
        }
    });

    var View = Backbone.View.extend({
        
        el: 'body',
        $fieldElement: $('.search-field'),
        active: false,

        initialize: function() {
            this.model = new Model();
            // model events
            this.model.on('change:suggestion', this.render, this);
            this.model.on('change_status', this.setStatus, this);

            //view events

            
            
            //this.model.getSuggestions();
            
        },
        events: {
            "keydown": "keyAction",
            "keyup .search-field": "searchFieldAction",
            "click .submit-search": "showResult"
        },
        _tpl: _.template(
            '<div class="dropdown-wrapper">'+
                '<div class="dropdown-inner-box">'+
                    '<ul class="search-direction <%-dirrectionClass%>"></ul>'+
                    '<ul class="suggestion-items">'+
                        '<% if (items.length) {%>'+
                            '<% for (var i = 0; i < items.length; i++) { %>'+
                                '<li class="item <% if (items[i].hasOwnProperty("active") && items[i].active) { %><%-active%><% } %>"><%- items[i].name %></li>'+    
                            '<% } %>'+
                        '<%} else {%>'+
                            '<div class="no-items">No results</div>'+
                        '<%}%>'+
                    '</ul>'+
                '</div>'+
            '</div>'
            ),
        
        render: function() {
            var tpl = this._tpl({
                dirrectionClass: '',
                items: this.model.get('suggestion')
            });

            if (this.model.get('active')) {
                $(tpl).show();
            } else {
                $(tpl).hide();
            }

            this.$el.append(tpl);
        },
        searchFieldAction: function(e) {
            var value = $(e.target).val().trim();

            if (value.length >= 3 && this.model.get('searchField') !== value) {
                this.model.trigger('get_suggestions');
            };
            this.model.set('searchField', value);
        },
        keyAction: function(e) {
            var _DOWN = 40,
                _TOP = 38;
            
            if (this.active) {
                if (e.keyCode === _TOP) {
                    this.model.trigger('set_previous');
                }
                if (e.keyCode === _DOWN) {
                    this.model.trigger('set_next');
                }
            }
          //  console.log(e.keyCode);
        },
        focusField: function() {
            this.$fieldElement.focus();
            this.$fieldElement.on('keydown', this.keyAction, this);
        },
        blurField: function() {
            this.$fieldElement.blur();
            this.$fieldElement.off('keydown', this.keyAction, this);
        },
        showResult:function(e) {
            console.log('Go to result page');
        },
        setStatus: function(status) {
            this.active = status;
        },
        showLoader: function() {

        }
    });

    return new View;
})();