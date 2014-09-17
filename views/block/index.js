var App = require('../../lib/app');
var templates = require('../../lib/templates.json');
var view = require('../../lib/view');
var bulk = require('bulk-require');
var editorModels = bulk(__dirname + '/../../components/block-editors', '**/*.js');

// Rename editor components
for (var id in editorModels) {
    editorModels[id + '-editor'] = editorModels[id];
    delete editorModels[id];
}

var id = null;
var app = null;
var index = null;
var block = null;

module.exports = view.extend({
    id: 'block',
    template: require('./index.html'),
    components: editorModels,
    data: {
        title: 'Edit',
        back: true
    },
    created: function () {
        var self = this;

        // Fetch app
        id = self.$parent.$data.params.id;
        index = self.$parent.$data.params.index;
        app = new App(id);
        block = app.data.blocks[index];
        // Bind app
        self.$data = block;
        self.$data.index = index;
        self.$data.getEditor = function (type) {
            var editorKey = type + '-editor';
            var defaultEditor = 'string-editor';
            var legalComponents = this.$compiler.options.components;
            if (legalComponents[editorKey]) {
                return editorKey;
            }
            return defaultEditor;
        };
        self.$data.remove = function (e) {
            e.preventDefault();
            app.remove(index);
            global.history.back();
        };
    }
});
