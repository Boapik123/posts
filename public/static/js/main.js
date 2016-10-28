;
(function($, undefined) {
	'use strict';

	// Variables
	var modal = $('#modal');
	var addPostButton = $('#add-post-button');
	var closeButton = $('#close');
	var addPostForm = $('#add-post-form');
	var content = $('#content');
	var authBlock = $('#auth-form');

	addPostButton.on('click', function(event) {
		event.preventDefault();
		modal.show();
	});

	closeButton.on('click', function(event) {
		event.preventDefault();
		modal.hide();
	});

	addPostForm.on('submit', function(event) {
		event.preventDefault();
		var data = new FormData(this);
		$.ajax({
			method: 'post',
			url: '/post',
			processData: false,
			contentType: false,
			data: data
		}).done(function(data) {
			modal.hide();
			var date = new Date(data.time);
			date = date.toLocaleString();
			$('.posts-list').prepend(postListRender(date, data.title, data.id));
		});
	});

	var postRender = function(imageSrc, title, body, createDate, id) {
		var result = $('<div></div>').addClass('post')
			.append($('<img/>').attr({
				src: imageSrc,
				alt: title
			}))
			.append($('<time></time>').addClass('time').attr({
				datetime: createDate
			}).text(createDate))
			.append($('<h2></h2>').addClass('title').text(title))
			.append($('<p></p>').addClass('description').text(body))
			.append($('<div></div>').addClass('asserts-block clearfix')
				.append($('<div></div>').addClass('col-xs-12 col-sm-6')
					.append($('<span></span>').addClass('count-comments')
						.append($('<span></span>').addClass('number comment-icon').attr({
							'data-id': id
						}))
					)
					.append($('<span></span>').addClass('rating hidden')
						.append($('<span></span>').addClass('number star-icon'))
					)
				)
				.append($('<div></div>').addClass('comment-show col-xs-12 col-sm-6').css({
					textAlign: 'right'
				})
					.append($('<a></a>').attr({
						class: 'comment-link',
						href: '#',
						title: 'Показать комментарии',
						'data-id': id
					}).text('Комментарии'))
				)
			)
			.append($('<div></div>').attr({
				id: 'comments',
				class: 'comments'
			}).css('display', 'none'));
			result.find('.comment-link').on('click', function(event) {
				event.preventDefault();
				getComments(this.dataset.id, this, location.pathname);
			});
		return result;
	};

	var postListRender = function(date, title, id) {
		var result = $('<li></li>').addClass('posts-item clearfix')
			.append($('<div></div>').addClass('col-xs-12')
				.append($('<time></time>').attr({
					class: 'time col-xs-12 col-sm-3 col-md-2',
					datetime: date
				}).text(date))
				.append($('<span></span>').addClass('post-title col-xs-12 col-sm-3 col-md-6').text(title))
				.append($('<div></div>').addClass('comment-show co-xs-9 col-sm-2 col-md-2')
					.append($('<a></a>').attr({
						class: 'comment-link',
						href: '#',
						'data-id': id
					}).text('Комментарии'))
				)
				.append($('<span></span>').addClass('rating col-xs-3 col-sm-2 col-md-1')
					.append($('<span></span>').addClass('number'))
				)
				.append($('<a></a>').attr({
					class: 'delete btn btn-danger col-xs-4 col-xs-offset-4 col-sm-2 col-sm-offset-0 col-md-1',
					href: '#',
					title: 'Удалить',
					'data-id': id
				}).text('Удалить'))
			)
			.append($('<div></div>').addClass('col-xs-12 col-sm-12')
				.append($('<div></div>').attr({
					id: 'comments'
				}).css('display', 'none'))
			);
			result.find('.delete').on('click', function(event) {
					event.preventDefault();
					console.log('delete');
					deletePost(this.dataset.id, this);
				});
			result.find('.comment-link').on('click', function(event) {
				event.preventDefault();
				getComments(this.dataset.id, this, location.pathname);
			});
			return result;
			// stars(id, result.find('.rating .number'));
	}

	var commentRender = function(body, createDate, rating, id) {
		var result = $('<div></div>').addClass('comment')
			.append($('<div></div>').addClass('row')
				.append($('<time></time>').attr({
					class: 'time col-xs-12 col-sm-3 col-md-2',
					datetime: createDate
				}).text(createDate))
				.append($('<p></p>').addClass('col-xs-9 col-sm-7 col-md-9').text(body))
				.append($('<div></div>').addClass('rating col-xs-3 col-sm-2 col-md-1')
					.append($('<span></span>').addClass('number star-icon').text(rating))
				)
			);
		return result;
	};

	var commentAdminRender = function(body, createDate, rating, id) {
		var result = $('<div></div>').addClass('admin-comment clearfix')
			.append($('<time></time>').addClass('time col-xs-12 col-sm-3 col-md-2').attr({
				datetime: createDate
			}).text(createDate))
			.append($('<p></p>').addClass('col-xs-9 col-sm-5 col-md-8').text(body))
			.append($('<div></div>').addClass('rating col-xs-3 col-sm-2 col-md-1')
				.append($('<span></span>').addClass('number star-icon').text(rating))
			)
			.append($('<a></a>').addClass('delete-comment btn btn-danger col-xs-4 col-xs-offset-4 col-sm-2 col-sm-offset-0 col-md-1').attr({
				href: '#',
				'data-id': id
			}).text('Удалить'));

		result.find('.delete-comment').on('click', function(e) {
			e.preventDefault();
			console.log('delete');
			deleteComment(this.dataset.id, this);
		});
		return result;
	}

	var newCommentRender = function(id) {
		var result = $('<form></form>').addClass('add-block clearfix')
			.append($('<input/>').attr({
				class: 'add-rating',
				type: 'text',
				hidden: true,
				name: 'rating'
			}))
			.append($('<input/>').attr({
				type: 'text',
				hidden: true,
				name: 'post_id',
				value: id
			}))
			.append($('<textarea></textarea>').attr({
				class: 'add-text from-control',
				name: 'body',
				rows: 3,
				placeholder: 'Текст комментария'
			}))
			.append($('<div></div>').addClass('rating-block')
				.append($('<span></span>').addClass('rating'))
				.append($('<span></span>').addClass('rating'))
				.append($('<span></span>').addClass('rating'))
				.append($('<span></span>').addClass('rating'))
				.append($('<span></span>').addClass('rating'))
			)
			.append($('<button></button>').attr({
				class: 'add-button btn btn-success col-xs-12 col-sm-4 col-sm-offset-4',
				type: 'submit'
			}).text('Добавить'));
		return result;
	};

	var getPosts = function(pathname) {
		$.ajax({
			method: 'GET',
			url: '/post'
		}).done(function(data) {
			if (pathname === '/') {
				var html = $('<div></div>');
				for (var i = data.length - 1; i >= 0; i--) {
					var date = new Date(data[i].time);
					date = date.toLocaleString();
					html.append(postRender(data[i].image, data[i].title, data[i].body, date, data[i]._id));
				}
			} else if (pathname === '/admin') {
				var html = $('<ul></ul>').addClass('posts-list');
				for (var i = data.length - 1; i >= 0; i--) {
					var date = new Date(data[i].time);
					date = date.toLocaleString();
					html.append(postListRender(date, data[i].title, data[i]._id));
				}
			}
			content.html('');
			content.append(html);
			if (pathname === '/') {
				countComments();
			}
		});
	};

	var getComments = function(id, target, pathname) {
		$.ajax({
			method: 'GET',
			url: '/comment/?post_id=' + id
		}).done(function(data) {
			if (pathname === '/') {
				var html = $('<div></div>');
				for (var i = data.length - 1; i >= 0; i--) {
					var date = new Date(data[i].time);
					date = date.toLocaleString();
					html.append(commentRender(data[i].body, date, data[i].rating, data[i]._id));
				}
				html.append(newCommentRender(id));
			} else if (pathname === '/admin') {
				var html = $('<div></div>');
				for (var i = data.length - 1; i >= 0; i--) {
					var date = new Date(data[i].time);
					date = date.toLocaleString();
					html.append(commentAdminRender(data[i].body, date, data[i].rating, data[i]._id));
				}
			}
				// commentRender(data[i].body, data[i].time, data[i].rating, id);
			var comments = $(target).parent().parent().parent().find('#comments');
			$(target).hide();
			$(target).parent().append($('<a></a>').attr({
				href: '#'
			}).text('Скрыть/Показать').on('click', function(event) {
				event.preventDefault();
				comments.toggleClass('hidden');
			}));
			comments.html('');
			// stars(id, comments.parent().find('.rating .number'));
			comments.css('display', 'block').append(html);

			$('.add-block .rating').on('click', function(event) {
				var target = $(this);
				target.parent().children().removeClass('active');
				target.addClass('active');
				var prev = target.prevAll();
				for (var i = 0; i < prev.length; i++) {
					$(prev[i]).addClass('active');
				}
			});

			$('.rating-block').on('click', function(event) {
				var count = $('.rating-block').find('.active');
				$('.add-block .add-rating').val(count.length);
			});

			$('.add-block').on('submit', function(event) {
				event.preventDefault();
				var self = this;
				var data = $(self).serialize();
				$.ajax({
					method: 'post',
					url: '/comment',
					data: data
				}).done(function(data) {
					var date = new Date(data.time);
					date = date.toLocaleString();
					// commentRender(data.body, date, data.rating, data._id).insertBefore('.comments .comment:first-child');
					var comments = $(self).parent().parent();
					var number = $(self).parent().parent().parent().find('.number.comment-icon');
					comments.prepend(commentRender(data.body, date, data.rating, data._id));
					console.log(number.text());
					number.text(parseInt(number.text()) + 1);
				})
			});
		});
	}

	var countComments = function() {
		$.ajax({
			method: 'GET',
			url: '/comment'
		}).done(function(data) {
			var comments= {};
			for (var i = 0; i < data.length; i++) {
				if (data[i].post_id in comments) {
					comments[data[i].post_id] += 1;
				} else {
					comments[data[i].post_id] = 1;
				}
			}
			var numbers = document.getElementsByClassName('number');
			for (var variable in comments) {
				if (comments.hasOwnProperty(variable)) {
					for (var i = 0; i < numbers.length; i++) {
						if (numbers[i].dataset.id === variable) {
							numbers[i].innerText = comments[variable];
						}
					}
				}
			}
		});
	};

	var deletePost = function(id, target) {
		$.ajax({
			method: 'delete',
			url: '/post/' + id,
		}).done(function(data) {
			console.log('Delete success');
			$(target).parent().parent().remove();
		})
	};

	var deleteComment = function(id, target) {
		$.ajax({
			method: 'delete',
			url: '/comment/' + id
		}).done(function(data) {
			console.log('Delete success');
			$(target).parent().remove();
		})
	};

	$(document).on('ready', function() {
		var pathname = location.pathname;
		if (pathname === '/' || pathname === '/admin') {
			getPosts(pathname);
		}
	});

})(jQuery);
