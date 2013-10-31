define([], function() {
    var $ = require("jQuery");
    var hr = require("hr/hr");
    var box = require("core/box");
    var search = require("core/search");

    // base docset
    var defaultDocset = "JavaScript";

    // Execute the search using http proxy from codebox
    var doksSearch = function(docset, query, callback) {
        $.getJSON(box.proxyUrl("http://api.doks.io/search"), {
            "q": query,
            "docset": docset
        }, callback);
    };

    //Add codebox search handler
    search.handler({
        'id': "doks",
        'title': "Documentation"
    }, function(query) {
        var d = new hr.Deferred();
        doksSearch(defaultDocset, query, function(data) {
            d.resolve(_.map(data.results, _.bind(function(result) {
                return {
                    "text": result.name+" ("+result.type+")",
                    "callback": _.bind(function() {
                        window.open(result.path);
                    }, this)
                };
            })));
        });
        return d;
    });
});

