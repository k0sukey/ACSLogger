var sdk;

$('#app-setting-submit').click(function(){
	if ($('#app-setting-submit').text() === 'Sign in') {
		sdk = new Cocoafish($('#app-setting-appkey').val());

		sdk.sendRequest('users/login.json', 'POST', {
			login: $('#app-setting-username').val(),
			password: $('#app-setting-password').val()
		}, function(e){
			if (e && e.meta && e.meta.code == 200) {
				$('#app-setting-submit').text('Sign out');
			} else {
				alert('Sign in failed');
			}
		});
	} else {
		sdk.sendRequest('users/logout.json', 'GET', null, function(e){
			if (e && e.meta && e.meta.code == 200) {
				$('#app-setting-submit').text('Sign in');
				sdk = undefined;
			} else {
				alert('Sign out failed');
			}
		});
	}
});

var loadlogs = function(level){
	var classname = $('#app-setting-classname').text() || 'logs';

	var where = '';
	if (level !== 'all') {
		where = '{"level":"' + level + '"}';
	}

	$('#' + level + ' tbody').empty();

	sdk.sendRequest('objects/' + classname + '/query.json', 'GET', {
		page: 1,
		per_page: 100,
		order: '-created_at',
		where: where
	}, function(e){
		if (e && e.meta && e.meta.code == 200) {
			var logs = e.response[classname];

			for (var i = 0; i < logs.length; i++) {
				if (level === 'all') {
					$('#' + level + ' tbody').append('<tr><td>'
					 + logs[i].created_at + '</td><td>'
					 + logs[i].level + '</td><td>'
					 + logs[i].message + '</td><td></td></tr>');
				} else {
					$('#' + level + ' tbody').append('<tr><td>'
					 + logs[i].created_at + '</td><td>'
					 + logs[i].message + '</td><td></td></tr>');
				}
			}
		}
	});
};

$('a[data-toggle="tab"]').on('shown', function(e){
	if (!sdk) { return; }

	var level = e.target.text.toLowerCase();
	if (level === 'all' || level === 'debug' || level === 'info' || level === 'warn' || level === 'error') {
		loadlogs(level);
	}
});

$('#reload-all').click(function(){
	if (!sdk) { return; }

	loadlogs('all');
});

$('#reload-debug').click(function(){
	if (!sdk) { return; }

	loadlogs('debug');
});

$('#reload-info').click(function(){
	if (!sdk) { return; }

	loadlogs('info');
});

$('#reload-warn').click(function(){
	if (!sdk) { return; }

	loadlogs('warn');
});

$('#reload-error').click(function(){
	if (!sdk) { return; }

	loadlogs('error');
});
