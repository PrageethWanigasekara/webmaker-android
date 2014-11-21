var App = require('../../lib/app');
var view = require('../../lib/view');
var throttle = require('lodash.throttle');

module.exports = view.extend({
    id: 'edit',
    template: require('./index.html'),
    data: {
        back: true,
        doneLabel: 'Publish'
    },
    created: function () {
        var self = this;

        // Fetch app
        var id = self.$parent.$data.params.id;
        var app = new App(id);

        // Bind app
        self.$data.app = app.data || {};
        self.$data.onDone = '/make/' + id + '/share?publish=true';
        self.$data.removeApp = function () {
            app.removeApp();
            self.page('/profile');
        };
        self.$watch('app.name', throttle(function (newVal) {
            app.firebase.update({
                name: newVal
            });
        }, 3000));
    }
});
