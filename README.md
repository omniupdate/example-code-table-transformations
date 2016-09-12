# Emergency Alerts jQuery plugin

Basic useful feature list:

 * Show active alert popup (Top, Bottom, Modal)
 * Add active alert widget to page.
 * Add archived alerts list widget to page
 * Add custom template to determine custom layout of widget or Pop-up

Setup Requirements:

 * jQuery minimum version 1.12.4
 * emergency-alerts.js
 * emergency-alerts.css


Basic Active Alert Pop-up Sample:

```javascript
$('body').OUAlert({
	type       : 'active', //default
    activePath : '/ou-alerts/active-alerts.xml', //default
    icon       : true
});
```

Active Alert Pop-up Options

>| option  |  default | description |
>| ------------- | ------------- | ------------- |
>| type  | ‘active’  |
>| popup  | true  |
>| activePath  | '/ou-alerts/active-alerts.xml'  | default path to active alerts file |
>| archivedPath  | '/ou-alerts/active-alerts.xml'  | default path to archived alerts file |
>| delay  | false  | specifies delay in ms, before popup shows |
>| closeOnClick  | false  | clicking anywhere closes the popup |
>| animationType  | 'animated-fast'  | animation timing CSS class for presenting popups (animated-super-fast, animated-fast, animated, animated-slow) |
>| showClass  | ‘fadeInDown’ | CSS animation class for presenting popups (zoomIn, fadeInDown, fadeInScale, expandOpen, jumpUp) |
>| hideClass  | ‘zoom out’ | CSS animation class for closing popups (zoomout) |
>| icon  | false  | Set to true to show icon alert icon in popup |
>| date  | true  | Set to false to hide date in popup |
>| title  | true  | Set to false to hide title in popup |
>| subtitle | true  | Set to false to hide subtitle in popup |
>| description  | true  | Set to false to hide description in popup |
>| emergency  | See Below  | Object that specifies how an emergency alert is rendered |
>| warning  | See Below  | Object that specifies how an warning alert is rendered |
>| announcement  | See Below  | Object that specifies how an announcement alert is rendered |

Custom Alert type handling sample (shows defaults):

```javascript
$('body').OUAlert({
	type       : 'active',
    activePath : '/ou-alerts/active-alerts.xml',
    icon       : true,
    emergency  : {
    	class           : 'oualerts-notify-error',
        position        : 'modal', //Positions are ‘top’, ‘bottom’, ‘modal’
        modalSize       : 'large', //Determines width of the modal if `position` is 'modal' (large, medium, small)
    	icon            : 'fa fa-bomb', //icon shown left of popup title. Icon CSS class or path to image.
        iconColor       : '#F44336', //Optional Ex: '#fff', sets icons color
        fontColor       : '', //Optional Ex: '#333', sets font color
        backgroundColor : '#FFC5C0', //Optional Ex: 'blue', sets background color
        template        : false //Optional, see below
    },
    warning  : {
    	class           : 'oualerts-notify-warning',
        position        : 'top',
    	icon            : 'fa fa-exclamation-circle', 
        iconColor       : '#f08a24',
        fontColor       : '',
        backgroundColor : '#FFE5C0',
        template        : false
    },
    announcement  : {
    	class           : 'oualerts-notify-info',
        position        : 'modal', 
    	icon            : 'fa fa-bullhorn',
        iconColor       : '#6091ba',
        fontColor       : '',
        backgroundColor : '#B3CFE8',
        template        : false 
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
| archiveHeader | true | Adds a header of "Archived Alerts" when type is 'archived' |
| icon | false | Renders icons next to the alert title. (icon is pulled from 'emergency', 'warning', or 'announcement' option object) |

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

## Custom Styling Options

**Severity States**

| class  | description |
| ------------- | ------------- |
| oualerts-error  | used when the severity is set to emergency|
| oualerts-warning  | used when the severity is set to warning|
| oualerts-info  | used when the severity is set to announcement|

**Display Types**

| class  | description |
| ------------- | ------------- |
| oualerts-modal | displaying the alert as a popup that covers the entire page|
| oualerts-top | displaying the alert as a banner at the top of the browser window|
| oualerts-bottom | displaying the alert as a banner at the bottom of the browser window|

**Homepage Styling**

| class  | description |
| ------------- | ------------- |
| oualerts-notify  | the main parent container for the alerts display|
| oualerts-notify-body  | the container for all of the below items|
| oualerts-notify-date  | the date and time of the alert|
| oualerts-notify-title  |  the title of the alert |
| oualerts-notify-subtitle | the subtitle of the alert |
| oualerts-notify-msg | the description of the alert |
| oualerts-notify-link  | the read more link, opens in a new window |
| oualerts-close | 'x' for closing the alert |

**Active Alert Page Styling**

| id  | description |
| ------------- | ------------- |
| active-alert  | the main parent container for the active alert and its updates to display|

| class  | description |
| ------------- | ------------- |
| oualerts-date | the date and time of the alert|
| oualerts-notify-title  |  the title of the alert |
| oualerts-notify-subtitle | the subtitle of the alert |
| oualerts-msg | the description of the alert |
| oualerts-active-update-list | the container for all of the updates |
| oualerts-active-update | can be multiple depending on the number of updates that are present |
| oualerts-active-update-title | the title of the alert update |
| oualerts-active-update-date | the date and time of the alert update |
| oualerts-active-update-msg | the description of the alert update |

**Archived Alerts Page Styling**

| id  | description |
| ------------- | ------------- |
| active-alert  | the main parent container for the archived alert and its updates to display|

| class  | description |
| ------------- | ------------- |
| oualerts-archive-wrapper | the sub-parent container for all of the archived alerts and their updates to display|
| oualerts-archive-list | the container for all of the archived alerts |
| oualerts-archive | can be multiple depending on the number of archived alerts that are present |
| oualerts-date  | the date and time of the alert|
| oualerts-title  |  the title of the alert |
| oualerts-subtitle | the subtitle of the alert |
| oualerts-msg | the description of the alert |
| oualerts-archive-update-header | the header to distinguish the updates for each archived alert |
| oualerts-archive-update-cont | the container for all of the updates |
| oualerts-archive-update | can be multiple depending on the number of updates that are present |
| oualerts-active-update-title | the title of the alert update |
| oualerts-active-update-date | the date and time of the alert update |
| oualerts-active-update-msg | the description of the alert update |
