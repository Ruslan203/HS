function wg(){
	$('.works__grid:not(.works__grid--detail)').mpmansory({
		childrenClass: 'works__item',
		breakpoints: {
			xl: 3,
			lg: 3,
			md: 4,
			sm: 6,
			xs: 6
		},
		distributeBy: {
			attr: 'data-order',
			attrOrder: 'desc',
		},
	});
}

function wgd(){
	$('.works__grid--detail').mpmansory({
		childrenClass: 'works__item',
		breakpoints: {
			xl: 4,
			lg: 6,
			md: 4,
			sm: 6,
			xs: 6
		},
		distributeBy: {
			attr: 'data-order',
			attrOrder: 'desc',
		},
	});
}

// image background
function ibg(){
	$('.ibg').each(function(){
		var url = $(this).find('img').first().attr('src');
		var alt = $(this).find('img').first().attr('alt');
		if (url) {
			$(this).css('background-image', 'url(' + url + ')');
			$(this).attr('title', alt);
		};
	});
};
ibg();

// отключаем якоря в урле
$.fancybox.defaults.hash = false;

function fancy(){
	// текущий урл
	var cur_url = window.location.pathname + window.location.search;
	// fancybox + ibg
	$('[data-fancybox]').fancybox({
		beforeShow: function( instance, current ) {
			// если не мой сервер - там не работает из-за путей
			if (window.location.href.indexOf("dnikonov") == -1) {
				if (current['type'] == 'ajax' && current['contentType'] == 'html') {
					// если есть урл для подстановки - подменяем
					if (current['opts'].hasOwnProperty('options') && current['opts']['options'].hasOwnProperty('url')){
						// console.log(current['opts']['options']['url']);
						window.history.pushState(null, null, current['opts']['options']['url']);
					};
				};
			};
		},
		afterShow: function( instance, current ) {
			if (current['type'] == 'ajax' && current['contentType'] == 'html') {
				ibg();
			};
		},
		beforeClose: function( instance, current ) {
			// если не мой сервер - там не работает из-за путей
			if (window.location.href.indexOf("dnikonov") == -1) {
				if (current['type'] == 'ajax' && current['contentType'] == 'html') {
					// возвращаем нормальный урл
					// console.log(cur_url);
					window.history.pushState(null, null, cur_url);
				};
			};
		}
	});
};
fancy();

$(function($) {

	// изменение контента
	$(document).on('DOMSubtreeModified', 'section.works', function(e){
		fancy();
	});

	// добавляем элементы в начале и в конце
	if ($('div').is('.slider')) {
		$.each($('.slider'), function(){
			if ($(this).find('.before').length == 0) {
				$(this).prepend('<span class="before">');
			};
			if ($(this).find('.after').length == 0) {
				$(this).append('<span class="after">');
			};
		});
	}

	// добавляем элементы в начале и в конце
	if ($('div').is('.line')) {
		$.each($('.line'), function(){
			if ($(this).find('.before').length == 0) {
				$(this).prepend('<span class="before">');
			};
			if ($(this).find('.after').length == 0) {
				$(this).append('<span class="after">');
			};
		});
	}

	// размеры окна
	var ww = 0;
	var wh = 0;

	function setwh(){
		ww = (window.visualViewport ? window.visualViewport.width * window.visualViewport.scale : window.innerWidth);
		wh = (window.visualViewport ? window.visualViewport.height * window.visualViewport.scale : window.innerHeight);
		if ($('div').is('.slider')) {
			var d = ww - $('.footer > .container').width();
			if (d > 0 && ww > 718 && ww < 992) {
				$('.slider').css({
					'margin-left': -(d/2),
					'margin-right': -(d/2)
				});
				$('.slider .before, .slider .after').css({
					'flex': '1 0 '+(d/2-10)+'px',
				});
			} else {
				$('.slider, .slider .before, .slider .after').removeAttr('style');
			};
		};
		if ($('div').is('.line')) {
			var d = ww - $('.footer > .container').width();
			$.each($('.line'), function(){
				$(this).find('.before, .after').show(0);
				if ($(this).find('div').width() >= $('.footer > .container').width()) {
					if (d > 0 && ww > 718 && ww < 992) {
						$(this).css({
							'margin-left': -(d/2),
							'margin-right': -(d/2)
						});
						$(this).find('.before, .after').css({
							'flex': '1 0 '+(d/2-10)+'px',
						});
					} else {
						$(this).removeAttr('style');
						$(this).find('.before, .after').removeAttr('style');
					};
				} else {
					$(this).find('.before, .after').hide(0);
				}
			});
		};
	}
	setwh();

	// пропорции
	var aspect = function(){
		$('[data-aspect]').each(function(){
			var aspect = $(this).data('aspect') || 1;
			$(this).css('height', $(this).outerWidth() / aspect);
		});
	}
	aspect();

	// recliner
	$(".lazy").recliner({
		attrib: "data-src",
		throttle: 300,
		threshold: wh,
		printable: true,
		live: true
	});
	$(document).on('lazyshow', '.lazy', function() {
		// var $e = $(this);
		// console.log('lazyshow', $e);
		ibg();
	});

	// бургер
	$(document).on('click', '.burger', function(e){
		e.preventDefault();
		$(this).toggleClass('active');
		$('.nav-mobile').toggleClass('active');
		$('body').toggleClass('fixed');
	});

	// профиль в шапке
	$(document).on('click', '.user__ava', function(){
		$(this).parent().toggleClass('user--active');
	});
	$(document).on('click', function(e) {
		if ($(e.target).closest('.user').length) return;
		$('.user--active').removeClass('user--active');
	});

	// показать форму добавления комментария
	$(document).on('click', '.comments__button', function(){
		$(this).parent().parent().hide(0);
		$(this).parent().parent().next().show(0);

		// прокрутка
    	let el = $(this).parent().parent().parent();
		if ($(this).parents('.popup').length == 0) {
        	$('html, body').stop().animate({'scrollTop': el.offset().top - $('.header').height() - 20}, 500);
		} else {
    		$('.fancybox-slide--current').stop().animate({'scrollTop': el.position().top}, 500);
		}
	});

	// показать полную информацию
	$(document).on('click', '.profile__show', function(){
		$(this).hide(0);
		$('.profile__detail').show(0);
	});

	// раскрыть фильтр
	$(document).on('click', '.filter__group-title', function(){
		$(this).parent().toggleClass('active');
	});

	// снять фильтр
	$(document).on('click', '.filter__positions div span', function(e){
		$('#' + $(this).data('filter') + ' input[value="'+$(this).data('val')+'"][data-name="'+$(this).data('name')+'"]').prop('checked', false);
		$('#' + $(this).data('filter') + ' input[type="submit"]').click();
		if ($(this).data('filter') == 'form_filter_catalog') {
			$('.catalog__filter input[value="'+$(this).data('val')+'"][data-name="'+$(this).data('name')+'"]').prop('checked', false);
		}
	});

	// сбросить весь фильтр
	$(document).on('click', '.filter__positions div.clear', function(e){
		$('#' + $(this).data('filter') + ' input[type="checkbox"]:checked').prop('checked', false);
		$('#' + $(this).data('filter') + ' input[type="submit"]').click();
		if ($(this).data('filter') == 'form_filter_catalog') {
			$('.catalog__filter input[type="checkbox"]:checked').prop('checked', false);
		}
	});

	// фильтр в каталоге
	// $(document).on('click', '.catalog__filter input[type="checkbox"]', function(){
	// 	console.log('1');
	// 	$('#form_filter_catalog input[data-name="'+$(this).data('name')+'"]').prop('checked', $(this).prop('checked'));
	// 	$('#form_filter_catalog input[type="submit"]').click();
	// });

	// выбор диалога
	$(document).on('click', '[data-dialog]', function(e){
		e.preventDefault();
		$('.popup__inner.dialogs').hide(0);
		$('.popup__inner.dialog').show(0);
		$('.messages__messages-inner').stop().animate({
			scrollTop: $('.messages__messages-inner')[0].scrollHeight
		}, 300);
	});
	// возврат к списку диалогов
	$(document).on('click', '.back-to-dialogs', function(e){
		e.preventDefault();
		$('.popup__inner.dialog').hide(0);
		$('.popup__inner.dialogs').show(0);
	});
	// автовысота textarea
	$(document).on('input', '#dialog__textarea', function(){
		var mh = 48;
		this.style.height = mh + 'px';
		if (this.scrollHeight > mh) {
			this.style.height = (this.scrollHeight) + 'px';
		} else {
			this.style.height = mh + 'px';
		}
		$('.messages__messages').css('padding-bottom', $(this).parent().parent().outerHeight());
	});

	// АВТОРИЗАЦИЯ ДЛЯ ПОКАЗА СВЕРСТАННОГО ПРОФИЛЯ - УДАЛИТЬ ПОСЛЕ НАТЯЖКИ
	var proflink = $('.header__profile-link');
	var profuser = $('.header__profile-user');
	if (proflink.length > 0 && profuser.length > 0) {
		// proflink.hide(0);
		profuser.hide(0);
		$(document).on('click', '#auth', function(){
			proflink.hide(0);
			profuser.show(0);
			$('#login_form button[data-fancybox-close]').click();
		});
	}

	// плитка в списке
	if ($('div').is('.works__grid:not(.works__grid--detail)')) {
		wg();
		// $(document).on('click', '.works-more', function(e){
		// 	e.preventDefault();
		// 	// ТУТ ПОЛУЧАЕМ ЭЛЕМЕНТЫ И ВСТАВЛЯЕМ ИХ
		// 	wg();
		// });
	}

	// плитка на деталке
	if ($('div').is('.works__grid--detail')) {
		wgd();
		// $(document).on('click', '.works-more', function(e){
		// 	e.preventDefault();
		// 	// ТУТ ПОЛУЧАЕМ ЭЛЕМЕНТЫ И ВСТАВЛЯЕМ ИХ
		// 	wgd();
		// });
	}

	// рейтинг
	$(document).on('click', '.stars__items span[data-num]', function(){
		var n = $(this).data('num');
		var p = $(this).parent();
		var i = p.next();
		if (p.hasClass('stars__items--'+n)) {
			p.removeClass('stars__items--'+n);
			i.val(0);
		} else {
			p.removeClass('stars__items--1 stars__items--2 stars__items--3 stars__items--4 stars__items--5');
			p.addClass('stars__items--'+n);
			i.val(n);
		};
	});

	// feedback slider
	var fsliderIsLive = false;
	function fslider(){
		if ($('div').is('.feedback-slider')) {
			if (ww >= 992) {
				if (!fsliderIsLive) {
					$('.feedback-slider').find('.before, .after').remove();
					$('.feedback-slider').slick({
						infinite: true,
						slidesToShow: 2,
						slidesToScroll: 1,
					});
					fsliderIsLive = true;
				};
			} else {
				if (fsliderIsLive) {
					$('.feedback-slider').slick('unslick');
					fsliderIsLive = false;
					// добавляем элементы в начале и в конце
					$('.feedback-slider').prepend('<span class="before">');
					$('.feedback-slider').append('<span class="after">');
				};
			};
		};
	};
	fslider();

	// comments slider
	var csliderIsLive = false;
	function cslider(){
		if ($('div').is('.comments-slider')) {
			if (ww >= 992) {
				if (!csliderIsLive) {
					$('.comments-slider').find('.before, .after').remove();
					$('.comments-slider').slick({
						infinite: true,
						slidesToShow: 3,
						slidesToScroll: 1,
					});
					csliderIsLive = true;
				};
			} else {
				if (csliderIsLive) {
					$('.comments-slider').slick('unslick');
					csliderIsLive = false;
					// добавляем элементы в начале и в конце
					$('.comments-slider').prepend('<span class="before">');
					$('.comments-slider').append('<span class="after">');
				};
			};
		};
	}
	cslider();

	// mask
	$('.phone-mask').unmask().mask('+7 (000) 000 00 00', {placeholder: "+7 (___) ___ __ __"});

	// chosen
	if ($('select').is('.chosen-select')) {
		$('.chosen-select').chosen();
	};

	// прячем поля формы
	if ($('select').is('[data-changeform]')) {
		$(document).on('change', 'select[data-changeform]', function(e){
			var t = $(this).data('changeform');
			var fields = $(this).children("option:selected").data('fields');
			// если исключаем поля из формы
			if (t == 'exclude') {
				$('div[data-field]').show(0);
				if (fields) {
					var a = fields.split(',');
					for (i = 0; i < a.length; i++) {
						if (a[i] != '') {
							$('div[data-field="'+a[i]+'"]').hide(0);
						};
					};
				};
			}
			// если включаем поля в форму
			if (t == 'include') {
				$('div[data-field]').hide(0);
				if (fields) {
					var a = fields.split(',');
					for (i = 0; i < a.length; i++) {
						if (a[i] != '') {
							$('div[data-field="'+a[i]+'"]').show(0);
						};
					};
				};
			}
		});
		$('select[data-changeform]').change();
	};

	// скрыть/показать ответы
	$(document).on('click', '.comments__answers-hide', function(e){
		e.preventDefault();
		$(this).toggleClass('active');
		$(this).parent().next().toggleClass('hide');
	});

	// ответить
	$(document).on('click', '.comments__answers-add', function(e){
		e.preventDefault();
		var f = $(this).parents('.answers').find('.comments__form');
		f.show(0);
		if ($(this).parents('.fancybox-slide').length == 0) {
			$('html, body').stop().animate({'scrollTop': f.offset().top - $('.header').height() - 20}, 300);
		}
		var ft = f.find('.textarea');
		ft.focus();
		if ($(this).data('for')) {
			ft.val($(this).data('for')+', '+ft.val());
		}
	});

	// share
	$(document).on('click', '.work__share', function(e){
		e.preventDefault();
		$(this).find('.ya-share2').toggleClass('active');
	});
	$(document).on('click', function(e) {
		if ($(e.target).closest('.work__share').length) return;
		$('.ya-share2.active').removeClass('active');
	});

	// delete
	$(document).on('click', '.works__delete', function(e){
		e.preventDefault();
		if (confirm('Удалить работу?')) {
			// нажали ДА
			var id = $(this).parent().parent().data('id');
			$.post(
				'/system/php/service.php',
				{_module: 'works', _action: 'delete', id: id},
				function(res) {
					if (res.result == 'success') {
						$('.works__item[data-id="' + id + '"]').remove();
						wg();
						wgd();
					} else {
						alert(res.reason);
					}
				},
				'json'
			);
			$.fancybox.close();
		} else {
			// нажали НЕТ
		};
	});

	// показать/скрыть длинный текст
	$(document).on('click', '.short-text__button', function(e){
		e.preventDefault();
		$(this).parent().prev().toggleClass('short-text--active');
		$(this).parent().toggleClass('short-text__controls--active');
	});

	// товары
	if ($('div').is('.catalog__item')) {
		// торговое предложение
		function setCatalogTP(el){

			// название товаров
			var cin = el.find('.catalog__name-link');
			cin.text(cin.data('name'));

			// набор параметров
			var p = '';

			// собираем набор параметров
			var cip = el.find('.catalog__params-group');
			$.each(cip, function(){
				var ir = $(this).find('input[type="radio"]:checked');
				if (ir.length > 0) {
					$.each(ir, function(){
						cin.text(cin.text() + ', ' + $(this).data('name'));
						p = p + $(this).attr('name') + ':' + $(this).val() + ',';
					});
				};
			});
			// если нет параметров
			if (p == '') {
				el.find('.catalog__image').first().removeClass('hide');
				el.find('.catalog__preview').first().addClass('active');
				el.find('.catalog__button-link').first().removeClass('hide');
				el.find('.catalog__cost').first().removeClass('hide');
				el.find('.catalog__discont').first().removeClass('hide');
			} else {
				// изображение
				var ci = el.find('.catalog__image[data-params="' + p + '"]');
				if (ci.length > 0) {
					el.find('.catalog__image').addClass('hide');
					ci.removeClass('hide');
				}
				// превью изображения
				var cp = el.find('.catalog__preview[data-params="' + p + '"]');
				if (cp.length > 0) {
					el.find('.catalog__preview.active').removeClass('active');
					cp.addClass('active');
				}
				// цена
				el.find('.catalog__cost').addClass('hide');
				var cc = el.find('.catalog__cost[data-params="' + p + '"]');
				if (cc.length > 0) {
					cc.removeClass('hide');
				}
				// скидка
				el.find('.catalog__discont').addClass('hide');
				var cd = el.find('.catalog__discont[data-params="' + p + '"]');
				if (cd.length > 0) {
					cd.removeClass('hide');
				}
				// кнопка
				el.find('.catalog__button-link').addClass('hide');
				var cbl = el.find('.catalog__button-link[data-params="' + p + '"]');
				if (cbl.length > 0) {
					cbl.removeClass('hide');
				}
			}
		}
		$.each($('.catalog__item'), function(){
			setCatalogTP($(this));
		});
		// изменение параметров
		$(document).on('change', '.catalog__radio', function(e){
			setCatalogTP($(this).parents('.catalog__item'));
		});
	};

	// выбор картинки
	$(document).on('click', '.catalog__preview', function(e){
		if (!$(this).hasClass('active')) {
			$(this).parents('.catalog__item').find('.catalog__preview.active').removeClass('active');
			$(this).addClass('active');
			$(this).parents('.catalog__item').find('.catalog__image').addClass('hide');
			$(this).parents('.catalog__item').find('.catalog__image[data-params="' + $(this).data('params') + '"]').removeClass('hide');
		};
	});

	// показать все варианты фильтра
	$(document).on('click', '.filter__show-all', function(e){
		e.preventDefault();
		$(this).parent().find('> div.hide').removeClass('hide');
		$(this).addClass('hide');
	});

	// если скрипт запущен с моего сервера
	if (window.location.href.indexOf("localhost") > -1 || window.location.href.indexOf("dnikonov") > -1) {

		// простой инпут файл
		function readURL(input, el) {
			if (input.files && input.files[0]) {
				el.addClass('active');
				var reader = new FileReader();
				reader.onload = function(e) {
					el.find('.dz-image img').attr('src', e.target.result);
				}
				reader.readAsDataURL(input.files[0]);
				el.find('input[type="hidden"]').val("N");
			} else {
				el.removeClass('active');
				el.find('input[type="hidden"]').val("Y");
			}
		}
		// удаление файла
		$(document).on('click', '.form__upload label.form__simple-file .dz-preview .dz-remove', function(e){
			e.preventDefault();
			$(this).parent().parent().parent().removeClass('active');
			$(this).parent().parent().parent().find('input[type="hidden"]').val("Y");
			$(this).parent().parent().find('input[type="file"]').val('');
			$(this).parent().find('img').attr('src', '');
		});
		// выбор файла
		$('.form__upload label.form__simple-file input[type="file"]').change(function() {
			readURL(this, $(this).parent().parent());
		});

		// контент для взрослых
		$(document).on('click', '.works__item--eye', function(e){
			e.preventDefault();
			$(this).removeClass('works__item--eye');
		});

		// like (ТУТ ЖЕ И НУЖНО ВЕШАТЬ АЯКС НА ОБРАБОТКУ ЛАЙКА)
		$(document).on('click', '.works__heart', function(e){
			$(this).parent().parent().toggleClass('works__item--liked');
		});

		// like на попапе (ТУТ ЖЕ И НУЖНО ВЕШАТЬ АЯКС НА ОБРАБОТКУ ЛАЙКА)
		$(document).on('click', '.work__heart', function(e){
			$(this).parent().parent().toggleClass('work__image--liked');
			$('.works__item[data-id="'+$(this).data('id')+'"]').toggleClass('works__item--liked'); // отмечаем лайк у работы в списке на странице
		});

		// dropzone
		if ($('div').is('.dropzone-cont')) {
			if ($('div.dropzone-cont').data('url')) {
				var url = $('div.dropzone-cont').data('url');
			} else {
				var url = $('div.dropzone-cont').parents('form').attr('action');
			}
			var dz = $('div.dropzone-cont').dropzone({
				url: url,
				addRemoveLinks: true,
				paramName: "file", // The name that will be used to transfer the file
				maxFilesize: 3, // MB
				accept: function(file, done) {
					if ($('.dropzone-cont').html() == '') {
						$('.form__upload').removeClass('active');
					} else {
						$('.form__upload').addClass('active');
					}
					if (file.type == "image/jpeg" || file.type == "image/png") {
						done();
					} else {
						done("Только JPG, PNG");
					}
				},
				removedfile: function(file) {
					file.previewElement.remove();
					if ($('.dropzone-cont').html() == '') {
						$('.form__upload').removeClass('active');
					} else {
						$('.form__upload').addClass('active');
					}
				}
			});
		};

		// применить фильтр
		$(document).on('submit', '#form_filter', function(e){
			e.preventDefault();
			var ch = $(this).find('input[type="checkbox"]:checked');
			var fpc = $('.filter__positions-cont');
			var fp = $('.filter__positions');
			var fr = $('.filter__results');
			var bf = $('.btn.filter__filters');
			fp.empty();
			fr.empty();
			bf.find('span').remove();
			if (ch.length > 0) {
				$.each(ch, function(){
					fp.append('<div class="btn btn--round">'+$(this).data('name')+'<span data-val="'+$(this).val()+'" data-name="'+$(this).data('name')+'" data-filter="form_filter"></span></div>');
				});
				fp.append('<div class="btn btn--round btn--white btn--link clear" data-filter="form_filter">Сбросить все</div>');
				bf.append('<span class="btn__indi">'+ch.length+'</span>');
				fpc.show(0);
			} else {
				fpc.hide(0);
			}
			// АЯКС ЗАПРОС
			fr.text('Найдено ' + Math.floor(Math.random() * Math.floor(999)) + ' работы');
			$.fancybox.close();
		});

		// применить фильтр каталога
		$(document).on('submit', '#form_filter_catalog', function(e){
			e.preventDefault();
			var ch = $(this).find('input[type="checkbox"]:checked');
			var fpc = $('.filter__positions-cont');
			var fp = $('.filter__positions');
			var fr = $('.filter__results');
			var bf = $('.btn.filter__filters');
			fp.empty();
			fr.empty();
			bf.find('span').remove();
			if (ch.length > 0) {
				$.each(ch, function(){
					fp.append('<div class="btn btn--round">'+$(this).data('name')+'<span data-val="'+$(this).val()+'" data-name="'+$(this).data('name')+'" data-filter="form_filter_catalog"></span></div>');
					$('.catalog__filter input[value="'+$(this).val()+'"][data-name="'+$(this).data('name')+'"]').prop('checked', true);
				});
				fp.append('<div class="btn btn--round btn--white btn--link clear" data-filter="form_filter_catalog">Сбросить все</div>');
				bf.append('<span class="btn__indi">'+ch.length+'</span>');
				fp.removeClass('d-none');
			} else {
				fp.addClass('d-none');
			}
			// АЯКС ЗАПРОС
			fr.text(Math.floor(Math.random() * Math.floor(999)) + ' товаров');
			$.fancybox.close();
		});

	};

	// tabs
	if ($('div').is('.tabs')) {
		$(document).on('click', '.tabs__link', function(e){
			e.preventDefault();
			if (!$(this).hasClass('active')) {
				$(this).parent().find('.active').removeClass('active');
				$(this).addClass('active');
				$('.tabs-data__content.active').removeClass('active');
				$('.tabs-data__content[data-id="' + $(this).data('id') + '"]').addClass('active');
			};
		});
		$('.tabs__link').first().click();
	};

	// click
	$('[data-click]').each(function(){
		$(this).on('click', function(e){
			e.preventDefault();
			// если это чекбокс то меняем состояние
			if ($(this).is('label')) {
				$(this).find('input[type="checkbox"]').prop('checked', !$(this).find('input[type="checkbox"]').prop('checked'));
			}
			// разбиваем на элементы и кликаем
			els = $(this).data('click').split(",");
			for (i = 0; i < els.length; i++) {
				var el = $(els[i]);
				el.click();
			};
		});
	});

	// scroll
	$(document).on('click', '[data-scroll]', function(e){
		e.preventDefault();
		var el = $($(this).data('scroll'));
   		if ($(this).parents('.popup').length == 0) {
			$('html, body').stop().animate({'scrollTop': el.offset().top - $('.header').height() - 20}, 500);
		} else {
       		$('.fancybox-slide--current').stop().animate({'scrollTop': el.position().top}, 500);
		};
	});

	// move
	$('[data-move]').each(function(){
		$($(this).data('move')).append($(this));
		$(this).removeClass('hide');
	});

	// ресайз окна
	$(window).on('resize', function(){
		setwh();
		aspect();
		fslider();
		cslider();
	});

	// скрол окна
	$(window).on('scroll', function () {
		// if ($(window).scrollTop() > wh) {
		// } else {
		// }
	});

});