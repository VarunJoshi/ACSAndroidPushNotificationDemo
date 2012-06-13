var win = Ti.UI.createWindow({
    backgroundColor : 'white'
});

win.open();


/*
 * First Step: Require cloudpush module
 */
var CloudPush = require('ti.cloudpush');
CloudPush.debug = true;
CloudPush.enabled = true;

CloudPush.showTrayNotificationsWhenFocused = true;
CloudPush.focusAppOnPush = false;

var deviceToken;
var Cloud = require('ti.cloud');

var registerButton = Ti.UI.createButton({
    title : 'Register For Push',
    color : '#000',
    height : 53,
    width : 200,
    top : 100,
});

win.add(registerButton);

/*
 * Second Step: Retrieve the device token using cloudpush module (only for Android)
 */
    
registerButton.addEventListener('click', function(e) {
    

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

});


/*
 * Third Step: Log in as a user
 */


function loginDefault(e) {

    Cloud.Users.login({
        login : 'cloudUser',
        password : 'test123'
    }, function(e) {
        if (e.success) {
            defaultSubscribe();
        } else {
            alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
        }
    });

}


/*
 * Fourth Step: Subscribe a channel
 */

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


/*
 * Fifth Step: Listen for the event callback
 */

CloudPush.addEventListener('callback', function(evt) {
    alert(evt);
});



CloudPush.addEventListener('trayClickLaunchedApp', function(evt) {
    Ti.API.info('Tray Click Launched App (app was not running)');
});


CloudPush.addEventListener('trayClickFocusedApp', function(evt) {
    Ti.API.info('Tray Click Focused App (app was already running)');
});
