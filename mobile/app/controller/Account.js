/*
 * File: app/controller/Account.js
 *
 * This file was generated by Sencha Architect
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.4.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.4.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('TaskManager.controller.Account', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            loginNavView: 'loginnavview',
            registerForm: 'registerform'
        },

        control: {
            "button#showLoginButton": {
                tap: 'onShowLoginButtonTap'
            },
            "button#showRegisterButton": {
                tap: 'onShowRegisterButtonTap'
            },
            "segmentedbutton#mysegmentedbutton": {
                toggle: 'onLanguageToggle'
            },
            "button#loginButton": {
                tap: 'onLoginButtonTap'
            },
            "button#registerButton": {
                tap: 'onRegisterButtonTap'
            },
            "button#doRegistrationButton": {
                tap: 'onDoRegistrationButtonTap'
            }
        }
    },

    onShowLoginButtonTap: function() {
        this.getLoginNavView().push({
            xtype: "loginform",
            locales:{
                title: 'panels.login.title'
            },
            title: "Login"
        });
    },

    onShowRegisterButtonTap: function() {
        this.getLoginNavView().push({
            xtype: "registerform",
            locales:{
                title: 'panels.register.title'
            },
            title: "Registration"
        });
    },

    onLanguageToggle: function(container, button, pressed) {
        if(pressed){
            var lang = button.getItemId();
            Ux.locale.Manager.updateLocale(lang);
        }
    },

    onLoginButtonTap: function(button, e, eOpts) {
        var form = button.up('formpanel'),
            values = form.getValues(),
            me = this;

        //success
        var successCallback = function (resp, ops) {
            form.unmask();
            var login = Ext.decode(resp.responseText);
            if (login) {
                TaskManager.user = Ext.create('TaskManager.model.User', login);
                me.loginSuccess();
            }else{
                var errorLabel = form.down('#messageLabel');
                errorLabel.setHidden(false);
            }
        };

        // Failure
        var failureCallback = function (resp, ops) {
            form.unmask();
            Ext.Msg.alert("Login Failure", resp, Ext.emptyFn);
        };

        Ext.Ajax.request({
            url: TaskManager.restUrl + 'user/login/',
            method: 'GET',
            params: {
                username : values.username,
                password : values.password
            },
            success: successCallback,
            failure: failureCallback
        });
        form.mask();
    },

    onRegisterButtonTap: function() {

    },

    onDoRegistrationButtonTap: function() {
        var me = this,
            data = this.getRegisterForm().getValues();

        var model = Ext.create('TaskManager.model.User', data);
        model.set('id', null);
        var errors = model.validate(), message = "";
        if (errors.isValid()) {
            model.save({
                success: function (record) {
                    //if reccord null there is already a user with this username in the database
                    if(record && record.get('id')){
                        TaskManager.user = record;
                        me.loginSuccess();
                    }
                    else{
                        Ext.Msg.alert(Ux.locale.Manager.get("messages.attention"), Ux.locale.Manager.get("messages.user_exist"), Ext.emptyFn);
                    }
                },
                failure: function () {
                    console.log('Salvatagio falito');
                }
            });
        }
        else {
            Ext.each(errors.items, function(r, i) {
                message += r.config.field + ' ' + r.config.message + "<br />";
            });
            Ext.Msg.alert(Ux.locale.Manager.get("messages.attention"), message, Ext.emptyFn);
        }

    },

    loginSuccess: function() {
        var taskNavView = Ext.create('TaskManager.view.TaskNavView');
        Ext.Viewport.add(taskNavView);
        Ext.Viewport.animateActiveItem(taskNavView, {
                type: 'slide',
                direction: 'left'
            });
    }

});