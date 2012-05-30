var sdk;

!function($){
	$(function(){
		window.prettyPrint && prettyPrint();

		$('#app-setting-submit').click(function(){
			sdk = new Cocoafish($('#app-setting-appkey').val());

			var classname = $('#app-setting-classname').text() || 'logs';

			sdk.sendRequest('objects/' + classname + '/query.json', 'GET', {
				page: 1,
				per_page: 1
			}, function(e){
				if (e && e.meta && e.meta.code == 200) {
					if ($('#app-setting-submit').hasClass('btn-danger')) {
						$('#app-setting-submit').removeClass('btn-danger');
					} else if ($('#app-setting-submit').hasClass('btn-primary')) {
						$('#app-setting-submit').removeClass('btn-primary');
					}

					$('#app-setting-submit').addClass('btn-success');
				} else {
					sdk = undefined;

					if ($('#app-setting-submit').hasClass('btn-primary')) {
						$('#app-setting-submit').removeClass('btn-primary');
					} else if ($('#app-setting-submit').hasClass('btn-success')) {
						$('#app-setting-submit').removeClass('btn-success');
					}

					$('#app-setting-submit').addClass('btn-danger');
				}
			});
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
							 + logs[i].message + '</td></tr>');
						} else {
							$('#' + level + ' tbody').append('<tr><td>'
							 + logs[i].created_at + '</td><td>'
							 + logs[i].message + '</td></tr>');
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

		$('#refresh-all').click(function(){
			if (!sdk) { return; }

			loadlogs('all');
		});

		$('#refresh-debug').click(function(){
			if (!sdk) { return; }

			loadlogs('debug');
		});

		$('#refresh-info').click(function(){
			if (!sdk) { return; }

			loadlogs('info');
		});

		$('#refresh-warn').click(function(){
			if (!sdk) { return; }

			loadlogs('warn');
		});

		$('#refresh-error').click(function(){
			if (!sdk) { return; }

			loadlogs('error');
		});
	});
}(window.jQuery);