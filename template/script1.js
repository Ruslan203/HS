function auth() {
	$('a[data-src="#login_form"]').trigger('click');
}

var filterParams;
var dz_addwork_photo = '';
var dz_comment_photos = [];
var RequestItems = function(){};

$(function($) {
	$(document).on('click', 'div[class^="ulogin-button"]', function() {
		$.fancybox.close();
	});

	$(document).on('click', '.works__heart', function(e) {
		let id = $(this).parents('.works__item').data('id');
		let parent = $(this).parents('.works__item');

		addLike(id, parent);
	});

	$(document).on('click', '.work__heart', function(e){
		let id = $(this).data('id');
		let parent = $(this).parent().parent();

		addLike(id, parent, true);
	});

	function addLike(id, parent, popup = false) {
		$.ajax({
			url: '/system/php/scripts/likes.php',
			method: 'POST',
			dataType: 'json',
			data: {id: id},
			success: function(data) {
				if (data.status == true) {
					if (popup) {
						parent.toggleClass('work__image--liked');
						$('.works__item[data-id="'+ id +'"]').toggleClass('works__item--liked');
					} else {
						parent.toggleClass('works__item--liked');
						parent.toggleClass('work__image--liked')
					}
				} else {
					if (data.reason == 'auth') {
						auth();
					}
				}
			}
		});
	}

	$(document).on('click', '.profile__subscribe-new, .profile__unsubscribe a', function(e){
		e.preventDefault();

		var id = $(this).data('id');

		$.ajax({
			url: '/system/php/scripts/follow.php',
			method: 'POST',
			dataType: 'json',
			data: {id: id},
			success: function(data) {
				if (data.status == true) {
					if (typeof data.html != 'undefined') {
						$('.profile__subscribe').prepend(data.html);
						$('.profile__subscribe-new').remove();
						$('.profile__detail').append('<div class="profile__unsubscribe"><a href="#" class="btn btn--transparent btn--w100" data-id="' + id + '">РћС‚РїРёСЃР°С‚СЊСЃСЏ</a></div>');
					} else {
						$('.profile__subscribe a[data-id="' + window.authenticated + '"]').remove();
						$('.profile__unsubscribe').remove();
						$('.profile__subscribe').append('<a href="#" class="profile__subscribe-new" data-id="' + id + '"></a>');
					}
				} else {
					if (data.reason == 'auth') {
						auth();
						return false;
					}
				}
			}
		});
	});

	// РєРѕРЅС‚РµРЅС‚ РґР»СЏ РІР·СЂРѕСЃР»С‹С…
	$(document).on('click', '.works__item--eye', function(e){
		e.preventDefault();

		if (window.authenticated) {
			$(this).removeClass('works__item--eye');
		} else {
			auth();
		}
	});

	// Dropzone С„РѕС‚Рѕ Рє РєРѕРјРјРµРЅС‚Р°СЂРёСЋ

	var dz_comments = $('.comments__upload div.dropzone-cont').dropzone({
		url: '/system/php/service.php',
		addRemoveLinks: true,
		paramName: "file", // The name that will be used to transfer the file
		maxFilesize: 10, // MB
		accept: function(file, done) {
			if ($('.dropzone-cont').html() == '') {
				$('.form__upload').removeClass('active');
			} else {
				$('.form__upload').addClass('active');
			}
			if (file.type == "image/jpeg" || file.type == "image/png") {
				done();
			} else {
				done("РўРѕР»СЊРєРѕ JPG, PNG");
			}
		},
		init: function() {
			this.on('sending', function(file, xhr, formData){
			    formData.append('_module', 'reviews');
			    formData.append('_action', 'photoUpload');
			});

			this.on('success', function(file, res) {

				if (res.result == 'error') {
					if (res.reason == 'auth') {
						auth();
					}
				}

			    if (res.result == 'success' && typeof res.id != 'undefined') {
			    	dz_comment_photos.push(res.id);
			    	file.id = res.id;
			    }

			    console.log(dz_comment_photos);
			});

			this.on('reset', function(file) {
				this.removeAllFiles();
    		});
		},
		removedfile: function(file) {
			$.post('/system/php/service.php?id=' + file.id,
				{
					_module: 'reviews',
					_action: 'photoDelete'
				},
				function(res) {
					if (res.result == 'success' && typeof res.deleted != 'undefined') {
						file.previewElement.remove();

						if ($('.dropzone-cont').html() == '') {
							$('.form__upload').removeClass('active');
						} else {
							$('.form__upload').addClass('active');
						}


						let index = dz_comment_photos.indexOf(res.deleted);
						if (index !== -1) dz_comment_photos.splice(index, 1);

						console.log(dz_comment_photos);
					}
			});
		}
	});

	// Dropzone С„РѕС‚Рѕ Рє РЅРѕРІРѕР№ СЂР°Р±РѕС‚Рµ

	var dz_addwork = $('#file-uploader-portfolio div.dropzone-cont').dropzone({
		url: '/system/php/service.php',
		addRemoveLinks: true,
		paramName: "file",
		maxFiles: 1,
		dictMaxFilesExceeded: 'Р”РѕСЃС‚СѓРїРЅРѕ С‚РѕР»СЊРєРѕ РѕРґРЅРѕ С„РѕС‚Рѕ РґР»СЏ Р·Р°РіСЂСѓР·РєРё.',
		maxFilesize: 10, // MB
		accept: function(file, done) {
			if ($('.dropzone-cont').html() == '') {
				$('.form__upload').removeClass('active');
			} else {
				$('.form__upload').addClass('active');
			}
			if (file.type == "image/jpeg" || file.type == "image/png") {
				done();
			} else {
				done("РўРѕР»СЊРєРѕ JPG, PNG");
			}
		},
		init: function() {
			this.on('sending', function(file, xhr, formData){
			    formData.append('_module', 'works');
			    formData.append('_action', 'photoUpload');
			});

			this.on('success', function(file, res) {
				if (res.result == 'error') {
					if (res.reason == 'auth') {
						auth();
					}
				}

			    if (res.result == 'success' && typeof res.filename != 'undefined') {
			    	dz_addwork_photo = res.filename;
			    	file.filename = res.filename;
			    }

			    console.log('РўСѓС‚ РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ РЅР°Р·РІР°РЅРёРµ РІСЂРµРјРµРЅРЅРѕРіРѕ С„Р°Р№Р»Р°: ' + dz_addwork_photo);
			});

			this.on('reset', function(file) {
				this.removeAllFiles();
    		});
		},
		removedfile: function(file) {
			$.get('/system/php/service.php?filename=' + file.filename,
				{
					_module: 'works',
					_action: 'photoDelete'
				},
				function(res) {
					if (res.result == 'success' && typeof res.deleted != 'undefined') {
						file.previewElement.remove();

						if ($('.dropzone-cont').html() == '') {
							$('.form__upload').removeClass('active');
						} else {
							$('.form__upload').addClass('active');
						}

						dz_addwork_photo = '';

						console.log(dz_addwork_photo);
					}
			});
		}
	});

	// Р”РѕР±Р°РІР»РµРЅРёРµ СЂР°Р±РѕС‚С‹
	$('.add-work, .edit-work').on('submit', function() {
	    $(this).ajaxSubmit({
			url: '/system/php/service.php',
	        beforeSubmit:  function(formData, form, options) {
			    formData[formData.length] = { name: 'photo', value: dz_addwork_photo };
			    $(this).attr('disabled', 'disabled');
	        },
	        success: function(res, status, form) {
	        	$(this).attr('disabled', 'disabled');
	        	if (res.result == 'success') {
	        		//if (typeof dropzone != 'undefined')
	        			//dz_addwork[0].dropzone.emit('reset');

	        		$('#work__result-success a:eq(0)').attr('href', res.link);

	        		$.fancybox.open({
						src  : '#work__result-success',
						type : 'inline'
					});
	        	} else {
	        		if (res.reason == 'auth') {
	        			auth();
	        			return;
	        		}

	        		$('#work__result-error p').text(res.reason);

	        		$.fancybox.open({
						src  : '#work__result-error',
						type : 'inline'
					});
	        	}
	        }
	    });

	    return false;
	});

	// Р”РѕР±Р°РІР»РµРЅРёРµ Р·Р°РєР°Р·Р°
	$('.request').on('submit', function() {
	    $(this).ajaxSubmit({
			url: '/system/php/service.php',
	        beforeSubmit:  function(formData, form, options) {
			    formData[formData.length] = { name: 'photo', value: dz_addwork_photo };
	        },
	        success: function(res, status, xrh, form) {
	        	if (res.result == 'success') {
	        		$('#request__result-success a:eq(0)').attr('href', res.link);

	        		$.fancybox.open({
						src  : '#request__result-success',
						type : 'inline'
					});
	        	} else {
	        		if (res.reason == 'auth') {
	        			auth();
	        			return;
	        		}

	        		$('#request__result-error p').text(res.reason);

	        		$.fancybox.open({
						src  : '#request__result-error',
						type : 'inline'
					});
	        	}
	        }
	    });

	    return false;
	});

	// Р”РѕР±Р°РІР»РµРЅРёРµ РєРѕРјРјРµРЅС‚Р°СЂРёСЏ
	$(document).on('submit', '.add-comment', function(e) {
		var rating;
	    $(this).ajaxSubmit({
			url: '/system/php/service.php',
	        beforeSubmit:  function(formData, form, options) {
	        	for (var i=0; i < formData.length; i++) {
			        if (!formData[i].value || formData[i].value == '0') {
			        	if (formData[i].name == 'rating') alert('РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РѕСЃС‚Р°РІСЊС‚Рµ РѕС†РµРЅРєСѓ.');
			            if (formData[i].name == 'text') alert('РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РЅР°РїРёС€РёС‚Рµ РѕС‚Р·С‹РІ.');

			            return false;
			        } else {
			        	if (formData[i].name == 'rating') rating = formData[i].value;
			        }
			    }

			    formData[formData.length] = { name: 'photos', value: JSON.stringify(dz_comment_photos) };

			    $(form).find('input[type="submit"]').attr('disabled', true);
	        },
	        success: function(res, status, xrh, form) {
	        	if (res.result == 'success') {
	        		form.parents('.row:eq(0)').hide();
	        		form.parents('.comments__add').find('.row:eq(0)').show();
	        		form.find('.stars__items').attr('class', 'stars__items');
	        		form.find('.comments__textarea textarea').val('');

	        		if (typeof dz_comments[0] != 'undefined') {
	        			dz_comments[0].dropzone.emit('reset');
	        		}

	        		$('.comments__messages .col-12').prepend(res.review);

	        		let el = $('#' + res.id);
	        		if (form.parents('.popup').length == 0) {
		        		$('html, body').stop().animate({'scrollTop': el.offset().top - $('.header').height() - 20}, 500);
	        		} else {
		        		$('.fancybox-slide--current').stop().animate({'scrollTop': el.position().top}, 500);
	        		}

	        	} else {
	        		if (res.reason == 'auth') {
	        			auth();
	        			return;
	        		}
	        	}

	        	$(form).find('input[type="submit"]').attr('disabled', false);
	        }

	    });

	    return false;
	});

	$(document).on('submit', '.add-comment-without-photo', function(e) {
	    $(this).ajaxSubmit({
			url: '/system/php/service.php',

		});

		return false;
	});

	// Р РµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ Р»РёС‡РЅС‹С… РґР°РЅРЅС‹С…
	$('.profile__edit').on('submit', function() {
	    $(this).ajaxSubmit({
			url: '/system/php/service.php',
	        success: function(res, status, form) {
	        	if (res.result != 'success') {
	        		if (res.reason == 'auth') {
	        			auth();
	        			return;
	        		}

	        		$('#profile__edit-result p').text(res.reason);
	        	}

	        	$.fancybox.open({
					src  : '#profile__edit-result',
					type : 'inline'
				});
	        }
	    });

	    return false;
	});

	// РћС‚РІРµС‚ РЅР° РєРѕРјРјРµРЅС‚Р°СЂРёР№
	$(document).on('submit', '.add-answer', function() {
	    $(this).ajaxSubmit({
			url: '/system/php/service.php',
	        beforeSubmit:  function(formData, form, options) {
			    $(form).find('input[type="submit"]').attr('disabled', true);
	        },
	        success: function(res, status, xhr, form) {
	        	$('#' + res.parent_id + ' .comments__messages').append(res.review);
	        	form.parent().hide();
	        	form.find('.textarea').val('');

	        	let el = $('#' + res.id);
        		if (form.parents('.popup').length == 0) {
		        	$('html, body').stop().animate({'scrollTop': el.offset().top - $('.header').height() - 20}, 500);
        		} else {
	        		$('.fancybox-slide--current').stop().animate({'scrollTop': el.position().top}, 500);
        		}

	        	form.find('input[type="submit"]').attr('disabled', false);
	        }
	    });

	    return false;
	});

	// РїСЂРёРјРµРЅРёС‚СЊ С„РёР»СЊС‚СЂ
	$(document).on('submit', '#form_filter', function(e){
		e.preventDefault();

		changeUrl();
		filter();

		$.fancybox.close();
	});

	// Р¤РёР»СЊС‚СЂ
	function filter() {
		var ch = $('#form_filter').find('input[type="checkbox"]:checked');
		var fpc = $('.filter__positions-cont');
		var fp = $('.filter__positions');
		var bf = $('.btn.filter__filters');
		var fr = $('.filter__results');
		fp.empty();
		fr.empty();
		bf.find('span').remove();
		if (ch.length > 0) {
			$.each(ch, function(){
				fp.append('<div class="btn btn--round">'+$(this).data('name')+'<span data-val="'+$(this).val()+'"></span></div>');
			});
			fp.append('<div class="btn btn--round btn--white btn--link clear">РЎР±СЂРѕСЃРёС‚СЊ РІСЃРµ</div>');
			bf.append('<span class="btn__indi">'+ch.length+'</span>');
			fpc.show(0);
		} else {
			fpc.hide(0);
		}
	}

	// РР·РјРµРЅРµРЅРёРµ Url
	function changeUrl(search) {
		let params = {};

		$('#form_filter').find('input:checked').each(function() {
			if (typeof params[this.name] === 'undefined') {
				params[this.name] = [];
			}

			params[this.name].push($(this).attr('data-code'));
		});

		let urlParams = [];

		for (var i in params) {
			urlParams.push(i + '/' + params[i].join(','));
		}

		let hashSet   = '/' + urlParams.join('/');

		let filterUrl;

		if (window.location.href.match('/index/')) {
			filterUrl = window.location.href.match(/.*index/);
		} else {
			filterUrl = window.location.href + 'index'
		}

		if (urlParams.length) {
			hashUrl = filterUrl + hashSet;
		} else {
			hashUrl = filterUrl.toString().replace(/index$/, '');
		}

		window.history.pushState("", document.title, hashUrl);

		RequestItems();
	}

	// РЈСЃС‚Р°РЅРѕРІРєР° С„РёР»СЊС‚СЂРѕРІ РёР· Url
	function getUrlFilters() {
		let filterBlock = $('#form_filter');

		filterBlock.find('input:checked').each(function() {
			$(this).attr('checked', false).triggerHandler('change');
		});

		var matches = document.location.href.match(/\/index\/(.+)(\?|$)/);

		if (matches) {
			var pairs = matches[1].split('/');

			for (var i = 0, l = pairs.length; i < l; i += 2) {
				var code = pairs[i];
				var values = pairs[i + 1];

				values.split(',').map(function(filter) {
					filterBlock.find('input[name="' + code + '"][data-code="' + filter + '"]').prop('checked', 'checked').triggerHandler('change');
				});
			}

			filter();
		}
	}

	getUrlFilters();

	// Ajax РїРѕРґРіСЂСѓР·РєР°
	function RequestItems(countOnly, append) {
		var url, itemsBlock, item, grid, titles;
		var uri = window.location.pathname.match(/(\w+)/g);

		let exceptions = [
			'index',
			'tattoo',
			'piercing',
			'tatuazh',
			'sketches',
			'removal',
			'mehendi',
			'scarring'
		];

		if (typeof uri[1] == 'undefined' || exceptions.indexOf(uri[1]) != -1 || uri[0] == 'wiki') {
			switch(uri[0]) {
				case 'users':
					url = '/system/php/template/filtered_masters.php';
					itemsBlock = $('.card-lines');
					item = '.card-line';
					titles = ['РјР°СЃС‚РµСЂ','РјР°cС‚РµСЂР°','РјР°СЃС‚РµСЂРѕРІ'];
					break;
				case 'tattoosalony':
					url = '/system/php/template/salons.php';
					itemsBlock = $('.card-lines');
					item = '.card-line';
					titles = ['СЃР°Р»РѕРЅ','СЃР°Р»РѕРЅР°','СЃР°Р»РѕРЅРѕРІ'];
					break;
				case 'photo':
					url = '/system/php/template/filtered_galleries.php';
					itemsBlock = $('.works__grid');
					item = '.works__item';
					titles = ['СЂР°Р±РѕС‚Р°','СЂР°Р±РѕС‚С‹','СЂР°Р±РѕС‚'];
					break;
				case 'wiki':
					itemsBlock = $('.works__grid');
					if (typeof uri[1] == 'undefined') {
						url = '/system/php/template/wiki-list.php';
						item = '.card-vert';
					} else {
						url = '/system/php/template/filtered_galleries.php';
						item = '.works__item';
					}
			}

			grid = (uri[0] == 'photo' || (uri[0] == 'wiki' && typeof uri[1] != 'undefined')) ? 'wg' : 'ibg';
		} else {
			url = '/system/php/template/master_gallery.php';
			itemsBlock = $('.works__grid');
			item = '.works__item';
			grid = 'wgd';
			titles = ['СЂР°Р±РѕС‚Р°','СЂР°Р±РѕС‚С‹','СЂР°Р±РѕС‚'];
		}

		var params = $.extend({}, filterParams);

		$('#form_filter').find('input:checked').each(function() {
			if (typeof params[this.name] === 'undefined') {
				params[this.name] = [];
			}

			params[this.name].push(this.value);
		});

		for (var i in params) {
			if (typeof params[i] == 'object') params[i] = params[i].join(',');
		}

		if (append) {
			params.start = itemsBlock.find(item).length;
		}

		$.getJSON(url, params).done(function(data) {
			if (append) {
				itemsBlock.append(data.html);
			} else {
				itemsBlock.html(data.html);
			}

			more_items_button(data.total, item);

			if (titles) {
				var fr = $('.filter__results');
				fr.text('РќР°Р№РґРµРЅРѕ: ' + data.total + ' ' + declOfNum(data.total, titles));
			}

			window[grid]();
		});
	}

	function declOfNum(number, titles) {
	    cases = [2, 0, 1, 1, 1, 2];
	    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
	}

	// РџРѕРєР°Р·Р°С‚СЊ РµС‰С‘
	$(document).on('click', '.more-items', function(e){
		e.preventDefault();
		RequestItems(false, true);
	});

	// РћС‚РѕР±СЂР°Р·РёС‚СЊ/РЎРєСЂС‹С‚СЊ РєРЅРѕРїРєСѓ "РџРѕРєР°Р·Р°С‚СЊ РµС‰С‘"
	function more_items_button(total, item) {
		setTimeout(function() {
			let length = $(item).length;
			if (length == total) {
			    $('.more-items').hide();
			} else {
				$('.more-items').show();
			}
		}, 100);
	}

	$(document).on('keyup', '#search', function() {
		var search_input = $('#search');
		if (search_input.val().length >= 3) {
			$('div.clear').trigger('click');
			filterParams.search = search_input.val();
			RequestItems();
		} else if (search_input.val().length == 0) {
			delete filterParams.search;
			RequestItems();
		}
	});

	var search = $( "input[name=search]" );

	search.autocomplete({
		serviceUrl: '/system/php/scripts/section_search.php',
		ajaxSettings: {
			method: 'POST'
		},
		params: {
			path: window.location.pathname
		},
		minChars: 3,
		triggerSelectOnValidInput: false,
		onSelect: function(suggestion) {

			window.open(suggestion.url, '_blank');
			$(this).val('');
		}
	});

	$.fancyConfirm = function(opts) {
	    opts = $.extend(
	      true,
	      {
	        title: "Are you sure?",
	        message: "",
	        okButton: "OK",
	        noButton: "Cancel",
	        callback: $.noop
	      },
	      opts || {}
	    );

	    $.fancybox.open({
	      type: "html",
	      src:
	        '<div class="fc-content p-5 rounded">' +
	        '<h2 class="mb-3">' +
	        opts.title +
	        "</h2>" +
	        "<p>" +
	        opts.message +
	        "</p>" +
	        '<p class="text-right">' +
	        '<a data-value="0" data-fancybox-close href="javascript:;" class="mr-2">' +
	        opts.noButton +
	        "</a>" +
	        '<button data-value="1" data-fancybox-close class="btn btn-primary">' +
	        opts.okButton +
	        "</button>" +
	        "</p>" +
	        "</div>",
	      opts: {
	        animationDuration: 350,
	        animationEffect: "material",
	        modal: true,
	        baseTpl:
	          '<div class="fancybox-container fc-container" role="dialog" tabindex="-1">' +
	          '<div class="fancybox-bg"></div>' +
	          '<div class="fancybox-inner">' +
	          '<div class="fancybox-stage"></div>' +
	          "</div>" +
	          "</div>",
	        afterClose: function(instance, current, e) {
	          var button = e ? e.target || e.currentTarget : null;
	          var value = button ? $(button).data("value") : 0;

	          opts.callback(value);
	        }
	      }
	    });
	  };


	$(document).on('click', '#not_works_already', function(e) {
		e.preventDefault();

		var this_ = $(this);

		$.fancyConfirm({
	      title: "Р’С‹ СѓРІРµСЂРµРЅС‹, С‡С‚Рѕ С…РѕС‚РёС‚Рµ РІС‹Р№С‚Рё РёР· СЃР°Р»РѕРЅР° ?",
	      message:
	        "Р’СЃРµ РІР°С€Рё СЂР°Р±РѕС‚С‹ РїРµСЂРµСЃС‚Р°РЅСѓС‚ РѕС‚РѕР±СЂР°Р¶Р°С‚СЊСЃСЏ РІ СЃР°Р»РѕРЅРµ, РЅРѕ РѕСЃС‚Р°РЅСѓС‚СЃСЏ РЅР° РІР°С€РµР№ Р»РёС‡РЅРѕР№ СЃС‚СЂР°РЅРёС†Рµ.",
	      okButton: "Р”Р°",
	      noButton: "РќРµС‚",
	      callback: function(value) {
	        if (value) {
	          	var salonId = this_.data('salon');
				$.getJSON('/system/php/service.php', {_module: 'auth', _action: 'exitFromSalon', salonId: salonId}, function(res) {
					if (res.result == 'success') {
						this_.prev('.profile__user').remove();
						$('a[data-salon="' + salonId + '"]').remove();
					}
				});
	        }
	      }
	    });
	});

});
