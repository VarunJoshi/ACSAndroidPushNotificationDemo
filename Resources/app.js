var win = Ti.UI.createWindow({
    backgroundColor : 'white'
});

win.open();

var CloudPush = require('ti.cloudpush');
CloudPush.debug = true;
CloudPush.enabled = true;
var deviceToken;
var Cloud = require('ti.cloud');

CloudPush.retrieveDeviceToken({
    success : function deviceTokenSuccess(e) {
        alert('Device Token: ' + e.deviceToken);
        deviceToken = e.deviceToken
        loginDefault(deviceToken);

    },
    error : function deviceTokenError(e) {
        alert('Failed to register for push! ' + e.error);
    }
});

function loginDefault(e) {
    if (!Ti.App.Properties.getString('cloudUser')) {
        Ti.App.Properties.setString('cloudUser', e)

        Cloud.Users.create({
            username : e,
            password : 'logmein',
            password_confirmation : 'logmein'
        }, function(e) {
            if (e.success) {
                Cloud.Users.login({
                    login : Ti.App.Properties.getString('cloudUser'),
                    password : 'logmein'
                }, function(e) {
                    if (e.success) {
                        defaultSubscribe();
                    } else {
                        alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
                    }
                });
            } else {
                alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
            }
        });

    } else {
        Cloud.Users.login({
            login : Ti.App.Properties.getString('cloudUser'),
            password : 'logmein'
        }, function(e) {
            if (e.success) {
                defaultSubscribe();
            } else {
                alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
            }
        });
    }

}

function defaultSubscribe() {
    Cloud.PushNotifications.subscribe({
        channel : 'alert',
        device_token : deviceToken,
        type : 'android'
    }, function(e) {
        if (e.success) {
            alert('Subscribed!');
        } else {
            alert('Error:' + ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}


CloudPush.addEventListener('callback', function(evt) {
    alert(evt);
});


CloudPush.addEventListener('trayClickLaunchedApp', function(evt) {
    Ti.API.info('Tray Click Launched App (app was not running)');
});
CloudPush.addEventListener('trayClickFocusedApp', function(evt) {
    Ti.API.info('Tray Click Focused App (app was already running)');
}); 




