$(function() {
	function loadSongs(length, data) {
		for (var i = 0; i < length; i++) {

			var $li = $(
				`<li data-id="${data[i].id}" name="0" data-img="${data[i].al.picUrl}" data-dt="${data[i].dt / 1000}">
	                            <div class="sg fl">
	                                <img class="auto-img" src="${data[i].al.picUrl}" />
	                            </div>
								
	                            <div class="fl info">
	                                <div class="st one-text">${data[i].name}</div>
	                                
	                            </div>
	                            <div class="s-time fr clearfix">
	                               <div class="dt fl">${dealSongTime(data[i].dt)}</div>
	                               <div class="animate fl">
	                                    <span class="line fl line1"></span>
	                                    <span class="line fl line2"></span>
	                                    <span class="line fl line1"></span>
	                                    <span class="line fl line2"></span>
	                               </div>
	                            </div>
	                        </li>`
			);

			var sg = [];
			for (var j = 0; j < data[i].ar.length; j++) {
				sg.push(data[i].ar[j].name);
			}
			var $singers = $(`<div class="sn one-text">${sg.join(' / ')}</div>`);

			$li.find('.info').append($singers);

			$('#current-list').append($li);
		}
	}

	//处理歌曲时间
	function dealSongTime(time) {
		var second = Math.floor(time / 1000 % 60);
		second = second >= 10 ? second : '0' + second;
		var minute = Math.floor(time / 1000 / 60);
		minute = minute >= 10 ? minute : '0' + minute;

		return minute + ':' + second;

	}

	var songsId = [];
	var beifensong = [];
	// 歌曲详情
	var songsDetails = [];
	var d = localStorage.songs;
	var c = localStorage.songs1;
	if (d) {
		d = JSON.parse(d);

		songsDetails = d.playlist.tracks.concat();

		//保存歌曲id
		for (var i = 0; i < d.privileges.length; i++) {
			songsId.push(d.privileges[i].id);
		}

		$('.local-song').text(songsId.length);

		loadSongs(20, songsDetails);
		first(d);

	} else if (c) {
		c = JSON.parse(c);
		songsDetails = c.playlist.tracks.concat();

		//保存歌曲id
		for (var i = 0; i < c.privileges.length; i++) {
			songsId.push(c.privileges[i].id);
		}

		$('.local-song').text(songsId.length);

		loadSongs(20, songsDetails);
		first(c);
	} else {
		//获取歌单
		$.ajax({
			type: 'GET',
			// url: 'http://www.arthurdon.top:3000/top/list?idx=1',
			url: 'https://www.arthurdon.top:10099/top/list?idx=1',
			success: function(data) {
				console.log('data ==> ', JSON.stringify(data));

				localStorage.setItem('songs', JSON.stringify(data))
				first(data);

				songsDetails = data.playlist.tracks.concat();

				//保存歌曲id
				for (var i = 0; i < data.privileges.length; i++) {
					songsId.push(data.privileges[i].id);
				}

				$('.local-song').text(songsId.length);
				loadSongs(20, songsDetails);
               window.location.reload();
			},

			error: function(data) {

				localStorage.setItem('songs1', JSON.stringify(beifen));
				songsDetails = beifen.playlist.tracks.concat();
				first(beifen);
				for (var i = 0; i < beifen.privileges.length; i++) {
					songsId.push(beifen.privileges[i].id);
				}
				console.log("A");
				$('.local-song').text(songsId.length);
				loadSongs(20, songsDetails);
			},
		})
	}

	function first(data) {
		//获取音频标签

		var audio = $('#audio')[0];

		var url = 'https://music.163.com/song/media/outer/url?id=';
		//初始化加载歌曲

		audio.oncanplay = function() {
			audio.playbackRate = $(".mainspeed").text();
			var self = this;

			var $liActive = $('li.active');
			//获取歌词
			var id = $liActive.data('id');
			$.ajax({
				type: 'GET',
				url: 'https://www.arthurdon.top:10099/lyric?id=' + id,
				success: function(data) {

					//移出其他歌词
					$('.words-box').css({
						top: wordsBoxTop + 'px'
					}).empty();

					console.log('data ==> ', data);
					console.log('data ==> ', data.lrc);
					var lyric = data.lrc.lyric.split(/[\n\r]+/);
					// console.log('lyric ==> ', lyric);

					for (var i = 0; i < lyric.length; i++) {
						var lrc = lyric[i].split(']');
						//歌词文本
						var text = lrc[1];

						if (text) {
							//歌词时刻
							var time = lrc[0].slice(1).split(':');

							var second = Number(time[0]) * 60 + Number(time[1]);



							// console.log('time ==> ', time);
							// console.log('text ==> ', text);

							var $p = $(`<p data-time="${second}">${text}</p>`);

							$('.words-box').append($p);
						}






					}

					self.play();
					$(".disc").css("animation-play-state", "running");
					$(".singer-img").css("animation-play-state", "running");

					$animate.find('.line').css({
						animationPlayState: 'running'
					})


					$liActive.attr('name', 1);

					//设置歌曲当前播放时间和歌曲总时间
					$('.dtime').text(dealSongTime(self.duration * 1000));

					$('.sing').each(function() {
						$(this).find('span').eq(0).text($liActive.find('.st').text());
						$(this).find('span').eq(1).text($liActive.find('.sn').text());
					})


					//歌手图片
					$('.singer-img').find('img').attr('src', $liActive.data('img'));

					$('.m-play-stop').css({
						background: 'url("./images/stop.png") no-repeat center center',
						backgroundSize: 'cover'
					})
					console.log("aaaa", $liActive.data('img'));
					$(".disc").css({
						background: `url( "${$liActive.data('img')}") no-repeat center center`,
						backgroundSize: "cover"
					})
					// $("disc").style.background=
					// $('.disc').attr('background', $liActive.data('img'));
				}
			})
			var $lis = $('.read-list li');
			var mode = $('.m-mode').data('value');
			if (mode == 1) {
				this.setAttribute("loop", true);
				console.log("aa");
			} else if (mode == 2) {
				this.removeAttribute("loop");

			} else if (mode == 3) {
				this.removeAttribute("loop");
			}

		}

		
		var $mMask = $('.m-mask');
		var mMaskWidth = $mMask.width();
		// var bfb= $('.m-progress').width()/progressWidth;
		var wordsBoxTop = parseFloat($('.words-box').css('top'));
		var num = 1;
		$(".speed").on("click", function() {
			num = num + 0.25;
			if (num > 2) {
				num = 0.25;
			}
			$(".speed").text(num);


			// console.log($(this).length);
		})
		console.log($('.m-progress').width());
		//监听音频试试变化
		audio.ontimeupdate = function() {
			
			audio.playbackRate = $(".mainspeed").text();
			var $ps = $('.words-box>p');
			var height = $ps.height();
            var cbox=document.getElementsByClassName("content-box")[0];
			$('.ctime').text(dealSongTime(this.currentTime * 1000));
        
			if (!isTouch) {
				if(	cbox.style.display="block"){
				var progressWidth = $('.m-progress').width();
					
				}else{
				var progressWidth = $('.b-progress').width();
				}
				
				// $('.m-progress').width() == 0 ? $('.b-progress').width() : $('.m-progress').width();
				// var progressWidth = $('.m-progress').width();
				var minLeft = 0;
				var maxLeft = progressWidth - mMaskWidth;
				//移动进度
				var x = this.currentTime / $('li.active').data('dt') * (maxLeft);
				
				var left = x <= minLeft ? minLeft : x >= maxLeft ? maxLeft : x;
				$('.m-mask').css({
					left: left + 'px'
				})

				$('.m-progress-active').css({
					width: x + 'px'
				})
			}

			//移动歌词
			for (var i = 0; i < $ps.length; i++) {
				//获取当前的p和下一个p元素
				var currentTime = $ps.eq(i).data('time');
				var nextTime = $ps.eq(i + 1).data('time');
				if (i + 1 == $ps.length) {
					nextTime = Number.MAX_VALUE;
				}

				if (this.currentTime >= currentTime && this.currentTime < nextTime) {

					$('.words-box').animate({
						top: wordsBoxTop - height * i + 'px'
					}, 150)

					if (i - 1 >= 0) {
						$ps.eq(i - 1).removeClass('sactive');
					}

					$ps.eq(i).addClass('sactive');

					break;
				}

			}
		}
		$(".disc").on("click", function() {
			$(".words")[0].style.display = "block";
			console.log("aa");
			this.style.display = "none";
		})
		$(".words").on("click", function() {
			$(".disc")[0].style.display = "block";
			console.log("bb");
			this.style.display = "none";
		})

		//播放完成
		audio.onended = function() {
			console.log('播放完成');
			$('li.active').find('.line').css({
				animationPlayState: 'paused'
			})

			$mMask.css({
				left: 0 + 'px'
			})
			$('.progress-active').css({
				width: 0 + 'px'
			})
			var mode = $('.m-mode').data('value');
			// $('.m-next').onclick();
			// audio.play();
			$(".m-next").click();
			// $('.ctime').text(dealSongTime(this.currentTime * 1000));
			// $('.dtime').text(dealSongTime(this.duration * 1000));
		}

		$(".heart").on("click", function() {
			if (good) {
				$(this).children().attr("src", "icon_qx6fzsbfkna/heart1.png");
				good = false;
			} else {
				$(this).children().attr("src", "icon_qx6fzsbfkna/heart.png");
				good = true;
			}

		})
		//点击进度条
		var isTouch = false;
		var x0 = 0;
		$('.m-event-progress').on('touchstart', function(e) {
			isTouch = true;
			var x = e.originalEvent.targetTouches[0].pageX - mMaskWidth / 2;
			var progressWidth = $('.m-progress').width();
			console.log(progressWidth);
			x0 = x;
			var minLeft = 0;
			var maxLeft = progressWidth - mMaskWidth;
			var left = x <= minLeft ? minLeft : x >= maxLeft ? maxLeft : x;

			$('.m-mask').css({
				left: left + 'px'
			})

			$('.m-progress-active').css({
				width: x + 'px'
			})

			audio.currentTime = x / maxLeft * $('li.active').data('dt');
		})

		//移动进度条
		$('.m-event-progress').on('touchmove', function(e) {
			var progressWidth = $('.m-progress').width();
			var x = e.originalEvent.targetTouches[0].pageX;
			x0 = x;

			var minLeft = 0;
			var maxLeft = progressWidth - mMaskWidth;
			var left = x <= minLeft ? minLeft : x >= maxLeft ? maxLeft : x;
			console.log(left);
			$('.m-mask').css({
				left: left + 'px'
			})

			$('.m-progress-active').css({
				width: x + 'px'
			})
		})

		//触碰松开时
		$('.m-event-progress').on('touchend', function(e) {
			var x = x0;
			var minLeft = 0;
			var progressWidth = $('.m-progress').width();
			var maxLeft = progressWidth - mMaskWidth;
			var left = x <= minLeft ? minLeft : x >= maxLeft ? maxLeft : x;
			console.log(left);
			$('.m-mask').css({
				left: left + 'px'
			})

			$('.m-progress-active').css({
				width: x + 'px'
			})

			audio.currentTime = x / maxLeft * $('li.active').data('dt');

			isTouch = false;
		})


		//保存用户浏览器的歌曲id
		var previewIds = [];
		var startsIndex = 0;
		var endIndex = 20;


		var ggday = true;
		$('#all-list>li').on('click', function() {

			$('.list,.nav').hide();
			$('.read-list').show();

			console.log(songsId);

			if (previewIds.length == 0) {
				previewIds = previewIds.concat(songsId.slice(startsIndex, endIndex));
				startsIndex = endIndex;
				endIndex += endIndex;
			}

			//加载15首歌曲
			if ($(this).data('title') == $('.read-list').data('title')) {
				return;
			}

			console.log('a');
			$('.read-list').empty();
			loadSongs(previewIds.length, songsDetail);

		})

		var $animate = null;
		$('#current-list>li').on('click', function() {
			console.log("asdsadsa");
			if (!$(this).hasClass('active')) {
				var $liActive = $('li.active');
				if ($liActive.length > 0) {
					$liActive.removeClass('active');

					if ($liActive.attr('name', 1)) {
						$liActive.find('.line').css({
							animationPlayState: 'paused'
						})
					}
				}
			}

			$animate = $(this).find('.animate');

			$(this).addClass('active');

			//获取歌曲的id
			var id = $(this).data('id');

			console.log('id ==> ', id);

			if (id == $(audio).attr('name')) {
				//播放同一首歌曲
				if ($(this).attr('name') == 0) {
					//播放
					$(this).attr('name', 1);
					audio.play();

					//播放动画
					$(this).find('.line').css({
						animationPlayState: 'running'
					})

					$('.m-play-stop').css({
						background: 'url("./images/stop.png") no-repeat center center',
						backgroundSize: 'cover'
					})

				} else {
					//停止
					$(this).attr('name', 0);
					audio.pause();

					//停止动画
					$(this).find('.line').css({
						animationPlayState: 'paused'
					})

					$('.m-play-stop').css({
						background: 'url("./images/play.png") no-repeat center center',
						backgroundSize: 'cover'
					})
				}

			} else {
				$(audio).attr('name', id);

				//通过歌曲id获取音频
				audio.src = url + id;
			}

		})

		$('.back').on('click', function() {
			$('.list,.nav').show();
			$('.read-list').hide();
		})

		//暂停或者播放
		$('.m-play-stop').on('click', function() {
			var $liActive = $('li.active');
			if ($liActive.length == 0) {
				//根据播放模式选择歌曲
				//<!-- 1: 单曲循环，2：列表循环 ，3：随机播放 -->
				//获取模式
				var mode = $('.m-mode').data('value');
				var $lis = $('.read-list li');
				var $li = null;
				if (mode == 1 || mode == 2) {
					$li = $lis.eq(0);
				} else if (mode == 3) {
					$li = $lis.eq(Math.floor(Math.random() * $lis.length));
				}

				var id = $li.data('id');
				audio.src = url + id;
				$animate = $li.find('.animate');
				$li.addClass('active');
				$(audio).attr('name', id);

			} else {
				var name = $liActive.attr('name');

				if (name == 0) {
					//播放
					$liActive.attr('name', 1).find('.line').css({
						animationPlayState: 'running'
					})

					$(this).css({
						background: 'url("./images/stop.png") no-repeat center center',
						backgroundSize: 'cover'
					})
					$(document).snowfall('clear');
					$(document).snowfall({
						image: "./images/huaban.png",
						flakeCount: 30,
						minSize: 5,
						maxSize: 22,
						zIndex: 1
					});
					$(".singer-img").css("animation-play-state", "running");
					$(".disc").css("animation-play-state", "running");
					audio.play();

				} else {
					//停止
					$liActive.attr('name', 0).find('.line').css({
						animationPlayState: 'paused'
					})

					$(this).css({
						background: 'url("./images/play.png") no-repeat center center',
						backgroundSize: 'cover'
					})

					audio.pause();
					$(".singer-img").css("animation-play-state", "paused");
					$(".disc").css("animation-play-state", "paused");
					$(document).snowfall('clear');
					$(document).snowfall({
						image: "./images/huaban.png",
						flakeCount: 30,
						minSize: 0,
						maxSize: 0,
						zIndex: 1
					});
				}
			}
		})

		//播放模式
		$('.m-mode').on('click', function() {
			var min = $(this).data('min');
			var max = $(this).data('max');
			var value = $(this).data('value');

			if (value == 3) {
				value = min;
				$(this).data('value', min);
			} else {
				$(this).data('value', ++value);
			}

			$(this).css({
				background: 'url("./images/' + value + '.png") no-repeat center center',
				backgroundSize: 'cover'
			})


		})

		//上一首
		$('.m-prev').on('click', function() {
			console.log(audio.src);
			var $activeLi = $('li.active');
			$(".like").css("background-image", "url(images/like.png)");
			var $lis = $('.read-list li');

			//如果不存在，随机播放
			if ($activeLi.length == 0) {
				//根据播放模式选择歌曲
				//<!-- 1: 单曲循环，2：列表循环 ，3：随机播放 -->
				//获取模式
				var mode = $('.m-mode').data('value');

				var $li = null;
				if (mode == 1 || mode == 2) {
					$li = $lis.eq(0);
				} else if (mode == 3) {
					$li = $lis.eq(Math.floor(Math.random() * $lis.length));
				}

				var id = $li.data('id');
				audio.src = url + id;
				$animate = $li.find('.animate');
				$li.addClass('active');
				$(audio).attr('name', id);
			} else {
				//如果存在被点击播放的音乐
				var index = $activeLi.index();
				var $thisLi = $lis.eq(index);
				console.log('index ==> ', index);

				//根据模式选择播放
				var mode = $('.m-mode').data('value');
				if (mode == 1 || mode == 2) {

					if (index == 0) {
						index = $lis.length - 1;
					} else {
						index--;
					}

				} else if (mode == 3) {

					index = Math.floor(Math.random() * $lis.length);
				}

				$thisLi.removeClass();
				if ($thisLi.attr('name') == 1) {
					$thisLi.attr('name', 0).find('.line').css({
						animationPlayState: 'paused'
					})
				}

				var $cLi = $lis.eq(index);
				var id = $cLi.data('id');
				audio.src = url + id;
				$animate = $cLi.find('.animate');
				$cLi.addClass('active');
				$(audio).attr('name', id);

			}

		})

		//下一首

		$('.m-next').on('click', function() {
			var $activeLi = $('li.active');

			var $lis = $('.read-list li');
			$(".like").css("background-image", "url(images/like.png)");
			//如果不存在，随机播放
			if ($activeLi.length == 0) {
				//根据播放模式选择歌曲
				//<!-- 1: 单曲循环，2：列表循环 ，3：随机播放 -->
				//获取模式
				var mode = $('.m-mode').data('value');

				var $li = null;
				if (mode == 1 || mode == 2) {
					$li = $lis.eq(0);
				} else if (mode == 3) {
					$li = $lis.eq(Math.floor(Math.random() * $lis.length));
				}

				var id = $li.data('id');
				audio.src = url + id;
				$animate = $li.find('.animate');
				$li.addClass('active');
				$(audio).attr('name', id);
			} else {
				//如果存在被点击播放的音乐
				var index = $activeLi.index();
				var $thisLi = $lis.eq(index);
				console.log('index ==> ', index);

				//根据模式选择播放
				var mode = $('.m-mode').data('value');
				if (mode == 1 || mode == 2) {

					if (index == $lis.length - 1) {
						index = 0;
					} else {
						index++;
					}

				} else if (mode == 3) {

					index = Math.floor(Math.random() * $lis.length);
				}

				$thisLi.removeClass();
				if ($thisLi.attr('name') == 1) {
					$thisLi.attr('name', 0).find('.line').css({
						animationPlayState: 'paused'
					})
				}

				var $cLi = $lis.eq(index);
				var id = $cLi.data('id');
				audio.src = url + id;
				$animate = $cLi.find('.animate');
				$cLi.addClass('active');
				$(audio).attr('name', id);

			}

		})


		//歌词
		$('.singer-img').on('click', function() {

			$('.song-word').show();
			$('.song-word').css({
				background: "url(9252150_140155649000_2.jpg)"

			})
			$('.content-box').hide();

			// console.log($('.b-progress').width());
		})

		//关闭歌词面板
		$('.close').on('click', function() {
			$('.song-word').hide();
			$('.content-box').show();
	
			// console.log($('.b-progress').width());
		})
		var good = true;
		$(".like").on("click", function() {
			if (good) {
				console.log("b");
				$(this).css("background-image", "url(images/like-active.png)");
				good = false;
			} else {
				$(this).css("background-image", "url(images/like.png)");
				good = true;
				console.log("A");
			}

		})

		var lil = document.querySelectorAll("#current-list>li");
		var li5 = $("#current-list").find("li");

		var li2 = document.querySelectorAll("#current-list .one-text");

		var pro = [];
		var pros = [];
		for (var i = 0; i < li2.length; i++) {
			pro.push(li2[i].innerHTML);
			i++;
		}
		console.log(pro);
		console.log(".current-list", lil)
		console.log(li2)
		$(".search").on('click', function() {
			console.log(li5.length);
			var keyword = $("#text1").val();
			if (keyword == undefined || keyword == '') {
				console.log('搜索关键字不能为空');
				return;
			}
			var reg = /<.*>/g;

			keyword = keyword.replace(reg, '').trim();
			$(".ul1").empty();
			for (var i = 0; i < li5.length; i++) { //匹配搜索关键词 if (data.music[i].title.indexOf(keyword)> -1) {
				//如果找到，将当前商品数据添加到pros数组中
				if (pro[i].indexOf(keyword) > -1) {
					console.log(li5[0]);
					var lili = $(li5[i]).clone(true);
					console.log(lili);
					// var lili = lil[i].cloneNode(true);
					// pros.push(lili);

					console.log("234")
					$(".ul1").append(lili);
					// console.log("1231", pros);

				}


			}
			// for (var i =  pros.length; i >0; i--) {
			// 	$(".ul1").empty();
			// 	console.log("as")
			// 	$(".ul1").append(pros[i]);
			// }

			// var li4 = document.querySelectorAll(".ul1>li");
			// console.log(li4);
			// for (var j = 0; j < li4.length; j++) {
			// 	li4[j].onclick = function() {
			// 		var url = 'https://music.163.com/song/media/outer/url?id=';
			// 		console.log(this.dataset.id);
			// 		audio.src = url + this.dataset.id;
			// 		audio.play();
			// 		console.log("A")
			// 	}
			// }

		})


	}


})
