(function ($, window) {
	'use strict';
    var OUAlerts = function (element, options) {
		this.el = $(element);
		this.$notification;
		this.$widget;
		this.orgPadding;
		this.severity;
		this.defaults = {
			archivedPath : '/ou-alerts/archived-alerts.xml',
			activePath : '/ou-alerts/active-alerts.xml',
			//Alert details
			icon         : false,
			title        : true,
			subtitle     : true,
			description  : true,
			link         : true,
			date         : true,
			dateFormat   : '',
			//behavior
			delay        : false,
			closeOnClick : true,
			popup        : true,
			//CSS classes
	        showClass: 'fadeInDown',
	        hideClass: 'zoomOut',
	        animationType : 'animated-fast',
	        emergency: {
	            class      : 'oualerts-notify-error',
	            position   : 'modal',
	            icon       : 'fa fa-exclamation-triangle',
	            iconColor  : '',
	            fontColor  : '',
	            backgroundColor : '',
	            template   : false
	        },
	        warning: {
	            class    : 'oualerts-notify-warning',
	            position : 'top',
	            icon     : 'fa fa-exclamation-circle',
	            iconColor : '',
	            fontColor : '',
	            backgroundColor : '',
	            template   : false
	        },
	        announcement: {
	            class    : 'oualerts-notify-info',
	            position : 'top',
	            icon     : 'fa fa-bullhorn',
	            iconColor  : '',
	            fontColor  : '',
	            backgroundColor : '',
	            template   : false
	        },
	        widgetTemplate : false,
	        archiveHeader : true
		};
		$.extend(this.defaults, options);

		if (options.emergencyPosition) {
			this.defaults.emergency.position = options.emergencyPosition
		}
		if (options.warningPosition) {
			this.defaults.warning.position = options.warningPosition
		}
		if (options.announcementPosition) {
			this.defaults.announcement.position = options.announcementPosition
		}

		this.init();
    };

    OUAlerts.prototype.init = function () {
    	var self = this;
    		
    	this.loading();

    	if (this.defaults.type === 'active') {
    		//this is an active alert
    		this.fetch('active').then(function(data) {
    			if (!data) { return; }
	    		if (self.defaults.popup === true) {
		    		self.notify(data.alert, self.defaults);
	    		} else {
	    			self.loading(true);
	    			//widget
	    			self.widget(data, self.defaults);
	    		}
    		});
    	} else {
    		this.fetch('archived').then(function(data) {
    			self.loading(true);
    			self.widget(data, self.defaults, true);
    		});    		
    	}
    };

    OUAlerts.prototype.fetch = function (type) {
    	var self = this,
    	    def  = $.Deferred(),
    	    path = type === 'active' ? this.defaults.activePath : this.defaults.archivedPath;

    	$.ajax({
	        type: "GET",
	        url: path,
	        dataType: "xml",
	        success: function(xml) {
	        	//parse data/sort content
	        	if (type === 'active') {
		        	def.resolve(self.prepareData(xmlToJson(xml)))
	        	} else {
		        	def.resolve(self.prepareArchivedData(xmlToJson(xml)))
	        	}
	        },
	        error : function (err) {
	        	def.reject(err);
	        }
	    });
	    return def;
    };

    OUAlerts.prototype.widget = function (data, options, archived) {
		if (typeof options.widgetTemplate === 'function') {
			this.$widget = options.widgetTemplate(data, options);
		} else {
			if (archived) {
				this.$widget = _createArchivedTemplate(data, options);
	    	} else {
	    		this.$widget = _createWidgetTemplate(data, options);
	    	}
		}
    	this.el.html(this.$widget);
    }

    OUAlerts.prototype.notify = function (alert, options) {
    	//top, bottom, or modal view
    	var css, self = this;
    	this.severity = alert['ou:severity'].toLowerCase();

    	if (typeof self.defaults[self.severity].template === 'function') {
    		this.$notification = self.defaults[self.severity].template(alert, options);
    	} else {
    		this.$notification = this.createNotificationTemplate(alert, options);
    	}

        if (options.closeOnClick) {
            $('body').click(function () {
                self.remove();
            });
        }

        if (options.delay) {
        	setTimeout(function() {
        		self.el.append(self.$notification);
        		if (self.defaults[self.severity].position === 'top') {
        			self.applyPadding();
        		}
        	}, options.delay);
        } else {
        	this.el.append(this.$notification);
        	if (self.defaults[self.severity].position === 'top') {
    			self.applyPadding();
    		}
        }    	
    };

    OUAlerts.prototype.calcPadding = function (orgPadding){
	    var alert = this.$notification;
	    var newPadding = orgPadding + alert.height() + 'px';
	    this.el.css('padding-top', newPadding);
	};

	OUAlerts.prototype.applyPadding = function (){
		this.orgPadding = parseInt(this.el.css('padding-top'));
	    this.calcPadding(this.orgPadding);    
	    $(window).resize(this.calcPadding(this.orgPadding));
	};

    OUAlerts.prototype.remove = function () {
    	var self = this;

    	if (this.defaults[this.severity.toLowerCase()].position === 'top') {
			this.el.css('padding-top', this.orgPadding);
    	}

    	this.$notification.removeClass(this.defaults.showClass)
                .addClass(this.defaults.hideClass);
            
        this.$notification.on('oanimationend animationend webkitAnimationEnd', function() { 
		   self.$notification.remove();
		});
    };

    OUAlerts.prototype.prepareArchivedData = function (data) {
    	var alerts = [];
    	if (!data.rss.channel.item.length) {
    		return false;
    	}
    	data.rss.channel.item.forEach(function (item) { 
    		if (item['dc:type']['#text'] === 'alert'){ 
    			item.updates = [];
    			data.rss.channel.item.forEach(function (update) {
    				if (update['dc:type']['#text'] === 'update' && update['dc:identifier']['#text'] === item['dc:identifier']['#text']){ 
		    			item.updates.push(clean(update)); 
		    		} 
    			});
    			alerts.push(clean(item));
    		}
    	});
    	var feed = {
    		archive : alerts,
    		channel : {
    			description : data.rss.channel.description['#text'],
    			language : data.rss.channel.language['#text'],
    			lastBuildDate : data.rss.channel.lastBuildDate['#text'],
    			link : data.rss.channel.link['#text'],
    			title : data.rss.channel.title['#text']
    		}
    	};

    	return feed;
    };

    OUAlerts.prototype.prepareData = function (data) {
    	var alert, updates = [];

    	if (!data.rss.channel.item.length) {
    		return false;
    	}

    	data.rss.channel.item.forEach(function (item) { 
    		if (item['dc:type']['#text'] === 'alert'){ 
    			alert = clean(item); 
    		} else
    		if (item['dc:type']['#text'] === 'update'){ 
    			updates.push(clean(item)); 
    		}
    	});

    	updates.sort(function (a, b) {
	        return new Date(b.pubDate) - new Date(a.pubDate);
	    });

    	var feed = {
    		alert : alert,
    		updates : updates,
    		channel : {
    			description : data.rss.channel.description['#text'],
    			language : data.rss.channel.language['#text'],
    			lastBuildDate : data.rss.channel.lastBuildDate['#text'],
    			link : data.rss.channel.link['#text'],
    			title : data.rss.channel.title['#text']
    		}
    	};

    	return feed;
    };

    //add loading class to container
    OUAlerts.prototype.loading = function (done) {
    	if (!this.defaults.popup && !done) {
    		this.el.addClass('loading');
    	} else
    	if (done) {
    		this.el.addClass('ready');
    		this.el.removeClass('loading');
    	}
    };

    var _createArchivedTemplate = function (data, options) {
    	var $archiveCont = $('<div class="oualerts-archive-wrapper"></div>')
    	var $archiveHeader = $('<h2>Archived Alerts</h2>');
    	var $archiveList = $('<ul class="oualerts-archive-list"></ul>');
    	
    	data.archive.forEach(function(item) {
    		var $alert = _alertTemplate(item, data);
    		var $tmpl = $('<li class="oualerts-archive"></li>');
    		var $updateCont = $('<ul class="oualerts-update-cont"/>');

    		$tmpl.append($alert);
    		//updates
    		if (item.updates && item.updates.length) {
    			var $updateContHeader = $('<h4 class="oualerts-archive-update-header">Updates: </h4>')
    			$tmpl.append($updateContHeader);
    			$tmpl.append($updateCont);
    			item.updates.forEach(function(update) {
       				var $update = _updateTemplate(update, options, true);
    				var $updateTmpl = $('<li class="oualerts-archive-update"></li>');
    				$updateTmpl.append($update);
    				$updateCont.append($updateTmpl);
	    		});
	    		$tmpl.append($updateCont);
    		}
    		$archiveList.append($tmpl);
    	});

    	if (options.archiveHeader) {
    		$archiveCont.append($archiveHeader);
    	}

    	$archiveCont.append($archiveList);

    	return $archiveCont;
    };

    var _alertTemplate = function (data, options) {
    	var $alertContainer = $('<div></div>');
    	var $alertDate = $('<div>' + convertDateTime(data.pubDate) + '</div>');
    	var $alertTitle = $('<h2 class="oualerts-title">' + data.title + '</h2>');
    	var $alertDescription = $('<div>' + data.description + '</div>');

    	$alertContainer
    	.append($alertDate)
    	.append($alertTitle);

    	if (data['ou:subtitle']) {
    		$alertContainer
	    	.append('<h3 class="oualerts-subtitle">' + data['ou:subtitle'] + '</h3>');
    	}

    	$alertContainer
    	.append($alertDescription);

    	return $alertContainer;
    };

    var _updateTemplate = function (data, options, archive) {
    	var $update =
    		'<div class="' + (archive ? '' : 'oualerts-active-update') + '">' + 
	    		'<div>' + 
	    		data.title + ' <span class="pull-right">' + convertDateTime(data.pubDate) + '</span>' + 
	    		'</div>' +
	    		'<div>' + data.description + '</div>' +
	    		// '<div>http://es6.com</div>' +
	    	'</div>';
    	return $update;
    };

    var _createWidgetTemplate = function (data, options) {
    	var $alertContainer = _alertTemplate(data.alert, options);
    	var $updateHeader = $('<h4>Updates:</h4>');
    	var $updateCont = $('<ul class="oualerts-active-update-list"/>');

    	data.updates.forEach(function(update) {
    		$updateCont.append(_updateTemplate(update, options));
    	});

    	$alertContainer
    	.append($updateHeader)
    	.append($updateCont);

    	return $alertContainer;
    }
    OUAlerts.prototype.createNotificationTemplate = function (alert, options) {
        var self = this,
        	$iconEl,
            $innerIconEl,
            $iconWrapper,
            $body,
            $notify = $('<div></div>', {
                'class': 'oualerts-notify ' + options[alert['ou:severity'].toLowerCase()].class + ' ' + options.animationType + ' ' + options.showClass
            });

        $body = $('<div class="oualerts-notify-body"/>');

        if (options.date) {
        	var date = convertDateTime(alert.pubDate);
			var $date = $('<div class="oualerts-notify-date">' + date + '</div>');
			$body.append($date);
        }
        if (options.title) {
        	var $title = $('<div class="oualerts-notify-title">' + alert.title + '</div>');
        	if (options.icon) {
        		var $icon = $('<i class="' + options[alert['ou:severity'].toLowerCase()].icon + '"></i>');
        		var iconColor = options[alert['ou:severity'].toLowerCase()].iconColor;
        		if (iconColor) {
        			$icon.css({ color : iconColor});
        		}
	            $title.prepend($icon);
	        }
        	$body.append($title);
        }
        if (options.subtitle && alert['ou:subtitle']) {
        	var $subTitle = $('<div class="oualerts-notify-subtitle">' + alert['ou:subtitle'] + '</div>');
        	$body.append($subTitle);
        }
        if (options.description) {
        	var $desc = $('<div class="oualerts-notify-msg">' + alert.description + '</div>');
	       	if (options.link && alert.guid && alert.guid.indexOf('.xml') < 0) {
	        	var $link = $('<a href="' + alert.guid + '" target="_blank" class="oualerts-notify-link"> Read More...</a>');
	        	$desc.append($link);
	        }
        	$body.append($desc);
        }

        $notify.append($body);

        //close button
    	$('<span class="oualerts-close">&times;</span>').click(function () {
            self.remove();
        }).appendTo($notify);

        if (options[alert['ou:severity'].toLowerCase()].position === 'bottom') {
    		$notify.addClass('oualerts-bottom');
    	} else
    	if (options[alert['ou:severity'].toLowerCase()].position === 'top') {
    		$notify.addClass('oualerts-top');
    	} else
    	if (options[alert['ou:severity'].toLowerCase()].position === 'modal') {
    		$notify.addClass('oualerts-modal');
    		$notify = $('<div class="oualerts-notify-modal-overlay"/>').append($notify);
    	}

    	var backgroundColor = options[alert['ou:severity'].toLowerCase()].backgroundColor;
		if (backgroundColor) {
			$notify.css({ backgroundColor : backgroundColor});
		}
		var fontColor = options[alert['ou:severity'].toLowerCase()].fontColor;
		if (fontColor) {
			$notify.css({ color : fontColor});
		}

        return $notify;
    };

    function convertDateTime(timestamp){
	    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	    var time = new Date(timestamp);
	    var ampm = (time.getHours() >= 12)?"PM":"AM";
	    var minutes = (time.getMinutes()<10?'0':'') + time.getMinutes();
	    var hours = time.getHours();
	    if (hours > 12) { hours -= 12; } else if (hours === 0) { hours = 12; }
	    var fullTime = " "+hours+":"+minutes+" "+ampm;
	    return monthNames[time.getMonth()]+" "+time.getDate()+", "+time.getFullYear()+fullTime;
	}

    function clean (data) {

    	for( var key in data) {
    		if (data[key]['#text']) {
    			data[key] = data[key]['#text'];
    		}
    	}

    	return data;
    };

    function xmlToJson(xml) {
		var obj = {};

		if (xml.nodeType == 3) { // text
			obj = xml.nodeValue;
		}
		if (xml.hasChildNodes()) {
			for(var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				if (typeof(obj[nodeName]) == "undefined") {
					obj[nodeName] = xmlToJson(item);					
				} else {
					if (typeof(obj[nodeName].push) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(xmlToJson(item));
				}
			}
		}
		return obj;
	};

	$.fn.OUAlert = function() {
		var _ = this, opt = arguments[0], l = _.length, i = 0;

        for(i; i < l; i++) {
            _[i].OUAlert =  new OUAlerts(_[i], opt);
        }
        return _;
	};

	window.OUAlerts = OUAlerts;

})(jQuery, window);
