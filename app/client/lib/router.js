var onBeforeActions = {
    loginRequired: function() {
        var currentUser = Meteor.userId();
        if (currentUser) {
            this.next();
        } else {
            this.layout('blankLayout');
            this.render('login');
        }
    },
    alreadyLoggedIn: function () {
        var currentUser = Meteor.userId();
        if (currentUser) {
            Router.go('dashboard');
        } else {
            this.next();
        }
    }
};

// Routes
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
});
Router.route('home', {
    path: '/',
    action: function() {
        var currentUser = Meteor.userId(),
            redirectTo = (currentUser)? 'dashboard' : 'login';
        Router.go(redirectTo);
    }
});
Router.route('/login', {
    layoutTemplate: 'blankLayout',
    onBeforeAction: onBeforeActions.alreadyLoggedIn
});
Router.route('/registracion', {
    name: 'join',
    layoutTemplate: 'blankLayout',
    onBeforeAction: onBeforeActions.alreadyLoggedIn
});
Router.route('/olvide-contrasena', {
    name: 'forgotPassword',
    template: 'forgotPassword',
    layoutTemplate: 'blankLayout',
    onBeforeAction: onBeforeActions.alreadyLoggedIn
});
Router.route('/reset-password/:token', {
    name: 'resetPassword',
    template: 'resetPassword',
    title: 'Reset Password',
    layoutTemplate: 'blankLayout',
    onBeforeAction: onBeforeActions.alreadyLoggedIn,
    data: function() {
        Session.set('resetPassword', this.params.token);
        return;
    }
});
Router.route('/dashboard', {
    title: 'Dashboard',
    onBeforeAction: onBeforeActions.loginRequired,
    waitOn: function() {
        return [Meteor.subscribe('categories'), Meteor.subscribe('entries'), Meteor.subscribe('targets')];
    }
});
Router.route('/movimientos', {
    name: 'entries',
    template: 'entries',
    title: 'Listado de movimientos',
    onBeforeAction: onBeforeActions.loginRequired,
    waitOn: function() {
        return [Meteor.subscribe('categories'), Meteor.subscribe('entries')];
    }
});
Router.route('/categorias', {
    name: 'categories',
    template: 'categories',
    title: 'Listado de categorias',
    onBeforeAction: onBeforeActions.loginRequired,
    waitOn: function() {
        return Meteor.subscribe('categories');
    }
});
Router.route('/objetivos-mensuales', {
    name: 'targets',
    template: 'targets',
    title: 'Listado de objetivos mensuales',
    onBeforeAction: onBeforeActions.loginRequired,
    waitOn: function() {
        return Meteor.subscribe('targets');
    }
});
