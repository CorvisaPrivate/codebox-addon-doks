define([], function() {
    return function(options, imports, register) {
        var $ = codebox.require("jQuery");
        var hr = codebox.require("hr/hr");
        var box = codebox.require("core/box");
        var search = codebox.require("core/search");
        var ace = imports.ace;

        // base docset
        var defaultDocset = "JavaScript";

        // Execute the search using http proxy from codebox
        var doksSearch = function(docset, query) {
            return hr.Requests.getJSON(box.proxyUrl("http://api.doks.io/search"), {
                "q": query,
                "docset": docset
            });
        };

        // Add codebox search handler
        search.handler({
            'id': "doks",
            'title': "Documentation"
        }, function(query) {
            return doksSearch(defaultDocset, query).then(function(data) {
                return _.map(data.results, _.bind(function(result) {
                    return {
                        "text": result.name+" ("+result.type+")",
                        "callback": _.bind(function() {
                            window.open(result.path);
                        }, this)
                    };
                }));
            });
        });

        // Add ace autocomplete
        var langTools = ace.require("ace/ext/language_tools");
        langTools.addCompleter({
            getCompletions: function(editor, session, pos, prefix, callback) {
                if (prefix.length === 0) { callback(null, []); return }

                doksSearch(defaultDocset, prefix).then(function(data) {
                    callback(null, _.map(data.results, function(result) {
                        return {
                            'name': result.name,
                            'value': result.name,
                            'score': 1,
                            'meta': result.type
                        }
                    }));
                });
            }
        });

        register(null, {});
    };
});

