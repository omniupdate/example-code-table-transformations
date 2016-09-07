# Emergency Alerts jQuery plugin

Basic useful feature list:

 * Show active alert popup (Top, Bottom, Modal)
 * Add active alert widget to page.
 * Add archived alerts list widget to page
 * Add custom template to determine custom layout of widget or Pop-up


Basic Active Alert Pop-up Sample:

```javascript
$('body').OUAlert({
	type       : 'active', //default
    activePath : '/ou-alerts/active-alerts.xml', //default
    icon       : true
});
```

Active Alert Pop-up Options
| option  |  default | description |
| ------------- | ------------- | ------------- |
| type  | ‘active’  |
| popup  | true  |
| activePath  | '/ou-alerts/active-alerts.xml'  | default path to active alerts file |
| archivedPath  | '/ou-alerts/active-alerts.xml'  | default path to archived alerts file |
| delay  | false  | specifies delay in ms, before popup shows |
| closeOnClick  | true  | clicking anywhere closes the popup |
| animationType  | 'animated-fast'  | animation timing CSS class for presenting popups (animated-super-fast, animated-fast, animated, animated-slow) |
| showClass  | ‘fadeInDown’ | CSS animation class for presenting popups (zoomIn, fadeInDown, fadeInScale, expandOpen, jumpUp) |
| hideClass  | ‘zoom out’ | CSS animation class for closing popups (zoomout) |
| icon  | false  | Set to true to show icon alert icon in popup |
| date  | true  | Set to false to hide date in popup |
| title  | true  | Set to false to hide title in popup |
| subtitle | true  | Set to false to hide subtitle in popup |
| description  | true  | Set to false to hide description in popup |
| emergencyPosition  |  '' | Short cut option, Sets position for emergency alerts|
| warningPosition  | ''  | Short cut option, Sets position for warning alerts |
| announcementPosition  | ''  | Short cut option, Sets position for announcement alerts |
| emergency  | See Below  | Object that specifies how an emergency alert is rendered |
| warning  | See Below  | Object that specifies how an warning alert is rendered |
| announcement  | See Below  | Object that specifies how an announcement alert is rendered |


Custom Alert type handling sample (shows defaults):

```javascript
$('body').OUAlert({
	type       : 'active',
    activePath : '/ou-alerts/active-alerts.xml',
    icon       : true,
    emergency  : {
    	class    : 'oualerts-notify-error',
        position : 'modal', //Positions are ‘top’, ‘bottom’, ‘modal’
    	icon     : 'fa fa-bomb', //icon shown left of popup title,
        iconColor: false, //Optional Ex: '#fff', sets icons color
        fontColor: false, //Optional Ex: '#333', sets font color
        backgroundColor : false, //Optional Ex: 'blue', sets background color
        template : false //Optional, see below
    },
    warning  : {
    	class    : 'oualerts-notify-warning',
        position : 'top',
    	icon     : 'fa fa-exclamation-circle', 
        iconColor: false,
        fontColor: false,
        backgroundColor : false,
        template : false //Optional, see below
    },
    announcement  : {
    	class    : 'oualerts-notify-info',
        position : 'modal', 
    	icon     : 'fa fa-bullhorn',
        iconColor: false,
        fontColor: false,
        backgroundColor : false,
        template : false 
    }
});
```

The 'emergency', 'warning', and 'announcement' objects are used to specify which class, position, icon, icon color, font color, background color, and optionally a custom template function for the given alert type. The 'template' option, if used, takes a function as its value with the following signature : function (data, options) {}; where 'data' is the data for the active/archived alert, and options are the passed options. This function must return the template that is going to be appended to the selector used. Unless you match the default CSS classes you will likely have to write your own CSS when using a custom template. 


Heres an example of a custom template usage.

```javascript
$('body').OUAlert({
	type       : 'active', //default
    activePath : '/ou-alerts/active-alerts.xml', //default,
    icon       : true,
    emergency  : {
        template : function (data, options) {
        	console.log("Alert data:",data);
        	var tmpl = 
            	'<div class="alert-container">' 
            		'<div class="alert-title">' + data.title + '</div>' +
            		'<div class="alert-desc">' + data.description + '</div>' +
            	'</div>'
        	return tmpl;
        }
    }
});
```



Active Alert widget Sample:

```javascript
$('#active-alert-div').OUAlert({
	type       : 'active', 
    activePath : '/ou-alerts/active-alerts.xml',
    popup      : false
});
```

Archived Alert widget Sample:

```javascript
$('#archived-alerts-div').OUAlert({
	type       : 'archived', 
    archivedPath : '/ou-alerts/archived-alerts.xml',
    popup      : false
});
```

When using as a widget the following options are availible :

| option  |  default | description |
| ------------- | ------------- | ------------- |
| type  | ‘active’  | 'active' or 'archived' data|
| popup  | true  | popup option must be set to false|
| widgetTemplate  | See Below | template function to specify a custom html template |
| archiveHeader | true | Adds a header of "Archived Alerts" when type is 'archived'

Custom widgetTemplate usage:

```javascript
$('#active-alert-div').OUAlert({
	type       : 'active', //default
    activePath : '/ou-alerts/active-alerts.xml',
    popup      : false,
	widgetTemplate : function (data, options) {
        console.log("Alert data:",data);
        var tmpl = 
            '<div class="alert-container">' 
                '<div class="alert-title">' + data.title + '</div>' +
                '<div class="alert-desc">' + data.description + '</div>' +
            '</div>'
        return tmpl;
    }
});
```