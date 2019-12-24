window.webPictureViewer = (function () {

	var style = document.createElement("style");
	style.type = "text/css";
	style.textContent = '';
	document.getElementsByTagName("HEAD").item(0).appendChild(style);

	var addCSS = function(str) {
		style.textContent = str;
	};

	function setCSS(el, obj) {
		for (var i in obj) {
			el.style[i] = obj[i];
			if (i === 'opacity') {
				el.style['filter'] = 'alpha(opacity='+obj[i]*100+')';
			} else if (i === 'transform') {
				el.style['transform'] = obj[i];
				el.style['-ms-transform'] = obj[i];
				el.style['-moz-transform'] = obj[i];
				el.style['-webkit-transform'] = obj[i];
				el.style['-o-transform'] = obj[i];
			}
		}
	};

	var device = (function() {

	  var Device = function() {
	    this.devices = {
	      1: 'unknow',
	      2: 'windows',
	      3: 'mac',
	      4: 'ipad',
	      5: 'iphone',
	      6: 'android'
	    };
	  };

	  Device.prototype.getCurrentDeviceId = function() {

	    var dvicename = 'unknow';
	    var p = navigator.platform;
	    var sUserAgent = navigator.userAgent.toLowerCase();
	    var system = {
	      windows: p.indexOf("Win") == 0,
	      mac: p.indexOf("Mac") == 0,
	      ipad: sUserAgent.match(/ipad/i) == "ipad",
	      iphone: sUserAgent.match(/iphone os/i) == "iphone os",
	      android: sUserAgent.match(/android/i) == "android"
	    };

	    for (var i in system) {
	      if (system[i]) {
	        dvicename = i;
	      }
	    }

	    for (var i in this.devices) {
	      if (this.devices[i] == dvicename) {
	        return i;
	      }
	    }

	    return 1;
	  };

	  Device.prototype.getNameByDeviceId = function(id) {
	    return this.devices[id];
	  };

	  Device.prototype.isPC = function() {
	    var id = this.getCurrentDeviceId();

	    if (id ===1 || id == 2 || id == 3) {
	      return true;
	    } else {
	      return false;
	    }
	  };

	  Device.prototype.isMobile = function() {
	    var id = this.getCurrentDeviceId();
	    if (id == 4 || id == 5 || id == 6) {
	      return true;
	    } else {
	      return false;
	    }
	  };

	  var device = new Device();

	  return device;

	}());

	// 容器
	var box = function() {

		// 运行状态  true运行 / false非运行
		this.status = false;

		this.body = document.getElementsByTagName('body')[0];
		this.html = document.getElementsByTagName('html')[0];

		this.images = [];
		this.imagesInfo = [];
		this.$marklayer = document.createElement("div");
		this.$close = document.createElement("a");
		this.$close.innerHTML = 'close';
		this.$previous = document.createElement("a");
		this.$previous.innerHTML = 'previous';
		this.$next = document.createElement("a");
		this.$next.href = "javascript:;";
		this.$next.innerHTML = 'next';

		this.$quantity = document.createElement("div");

		// 屏幕的尺寸
		this.clientWidth = document.documentElement.clientWidth;
		this.clientHeight = document.documentElement.clientHeight;

		// 当前第几张图片
		this.currentImgIndex = 0;
	};

	box.prototype.init = function() {

		var that = this;

		this.body.appendChild(this.$close);
		this.body.appendChild(this.$previous);
		this.body.appendChild(this.$next);
		this.body.appendChild(this.$marklayer);
		// this.body.appendChild(this.$quantity);

		// setCSS(this.$quantity, {
		// 	'position': 'fixed', 'width': '100%', 'height': '40px',  'lineHeight': '40px', 'left': 0, 'top': '100%', 'zIndex': '1000', 'textAlign': 'center',
		// 	'backgroundColor': 'rgba(0, 0, 0, .65)', 'margin': '-40px 0 0 0', 'color':'#fff'
		// });

		setCSS(this.$marklayer, {
			'position': 'fixed', 'width': '100%', 'height': '100%', 'left': 0, 'top': 0, 'zIndex': '1000',
			'overflowX': 'auto', 'overflow': 'scroll',
			'backgroundColor': 'rgba(0, 0, 0, .5)',
			'display': 'none'
		});

		setCSS(this.$close, {
			'position': 'fixed', 'top': '0','left': '100%', 'width': '60px', 'height': '30px', 'lineHeight': '30px', 'textAlign': 'center', 'margin': '10px 0 0 -70px',
			'color': '#fff', 'background': '#000', 'opacity': '0.3', 'zIndex': '999999', 'display': 'none'
		});

		setCSS(this.$previous, {
			'position': 'fixed', 'top': '0','left': '0', 'width': '60px', 'height': '30px', 'lineHeight': '30px', 'textAlign': 'center', 'margin': '-15px 0 0 -60px',
			'color': '#fff', 'background': '#000', 'opacity': '0.3', 'zIndex': '999999', 'display': 'none'
		});

		setCSS(this.$next, {
			'position': 'fixed', 'top': '0','left': '0', 'width': '60px', 'height': '30px', 'lineHeight': '30px', 'textAlign': 'center', 'margin': '-15px 0 0 0',
			'color': '#fff', 'background': '#000', 'opacity': '0.3', 'zIndex': '999999', 'display': 'none'
		});

	};

	box.prototype.hide = function() {

		var self = this;

		addCSS(
			'@keyframes fade-out { 0% { opacity:1; } 100% { opacity:0; } } '+
			'@-ms-keyframes fade-out { 0% { opacity:1; } 100% { opacity:0; } } '+
			'@-moz-keyframes fade-out { 0% { opacity:1; } 100% { opacity:0; } } '+
			'@-webkit-keyframes fade-out { 0% { opacity:1; } 100% { opacity:0; } } '+
			'@-o-keyframes fade-out { 0% { opacity:1; } 100% { opacity:0; } } '+
			'.fade-out{'+
				'animation-name: fade-out; -webkit-animation-duration: .5s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
				'-ms-animation-name: fade-out; -webkit-animation-duration: .5s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
				'-moz-animation-name: fade-out; -webkit-animation-duration: .5s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
				'-webkit-animation-name: fade-out; -webkit-animation-duration: .5s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
				'-o-animation-name: fade-out; -webkit-animation-duration: .5s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
			'}'
		);

		var end = function() {
			self.$marklayer.removeEventListener("webkitAnimationEnd", end, false);
			self.$marklayer.style.display = 'none';
			self.$marklayer.className = '';

			for (var i = 0, max = self.images.length; i < max; i++) {
				var parent = self.images[i].parentNode;
				parent.parentNode.removeChild(parent);
			}

			self.images.length = 0;
			self.imagesInfo.length = 0;
			self.currentImgIndex = 0;
		};

		this.$marklayer.addEventListener("webkitAnimationEnd", end, false);
		this.$marklayer.className = 'fade-out';

		this.$close.style.display = 'none';
		this.$previous.style.display = 'none';
		this.$next.style.display = 'none';
		this.status = false;
		setCSS(this.body, { 'overflow':'' });
		setCSS(this.html, { 'overflow':'' });
	};

	// 设置图片的比例
	box.prototype.scale = function(width, animation) {

		var imgInfo = this.imagesInfo[this.currentImgIndex];

		imgInfo.scale = width/imgInfo.width;

		setCSS(this.images[this.currentImgIndex], {
			'transform':'scale('+imgInfo.scale+','+imgInfo.scale+') translate('+imgInfo.translate.x+'px, '+imgInfo.translate.y+'px)'
		});

	};

	// 超出边缘时，调整到边缘的零界点
	box.prototype.adjustPosition = function(index, width) {

		index = index || this.currentImgIndex;

		var img 					 = this.imagesInfo[index],
				currentWidth 	 = parseInt(img.width * img.scale),
				currentHeight  = parseInt(img.height * img.scale),
				targetPosition = { x: 0, y: 0 };

		if (!width) {

			width = currentWidth;

			if (currentWidth < this.clientWidth) {
				if (currentWidth < img.width) {
					width = img.width > this.clientWidth ? this.clientWidth : img.width;
				}
			} else if (currentWidth > img.width * 3) {
				width = img.width * 3;
			} else if (currentWidth > this.clientWidth * 3) {
				width = this.clientWidth * 3;
			}

		}

		var scale = width/img.width;

		if (currentHeight > this.clientHeight) {

			var h = parseInt(((img.height*scale - this.clientHeight)/scale)/2);

			if (img.translate.y < h * -1 && img.translate.y > h) {
				targetPosition.y = 0;
			} else if (img.translate.y < h * -1) {
				targetPosition.y = -h;
			} else if (img.translate.y > h) {
				targetPosition.y = h;
			} else {
				targetPosition.y = img.translate.y;
			}

		} else {

			if (img.height > this.clientHeight && img.translate.y != 0) {
				targetPosition.y = img.translate.y;
			}

		}

		if (currentWidth > this.clientWidth) {

			var w = parseInt(((img.width*scale - this.clientWidth)/scale)/2);

			if (img.translate.x < w * -1 && img.translate.x > w) {
				targetPosition.x = 0;
			} else if (img.translate.x < w * -1) {
				targetPosition.x = -w;
			} else if (img.translate.x > w) {
				targetPosition.x = w;
			} else {
				targetPosition.x = img.translate.x;
			}

		} else {

			if (img.width > this.clientWidth && img.translate.x != 0) {
				targetPosition.x = img.translate.x;
			}

		}

		setCSS(this.images[index], {'transform':'scale('+scale+', '+scale+') translate('+targetPosition.x+'px, '+targetPosition.y+'px)'});

		// 如果图片位置没有变化，比列没有发生变化，不执行动画
		if (targetPosition.x === img.translate.x && targetPosition.y === img.translate.y && img.scale === scale) {
			return;
		}

		addCSS(
			'@keyframes fadeIn { 0% { transform:scale('+img.scale+', '+img.scale+') translate('+img.translate.x+'px, '+img.translate.y+'px); } 100% { transform:scale('+scale+', '+scale+') translate('+targetPosition.x+'px, '+targetPosition.y+'px); }} '+
			'@-ms-keyframes fadeIn { 0% { -ms-transform:scale('+img.scale+', '+img.scale+') translate('+img.translate.x+'px, '+img.translate.y+'px); } 100% { -ms-transform:scale('+scale+', '+scale+') translate('+targetPosition.x+'px, '+targetPosition.y+'px); }} '+
			'@-moz-keyframes fadeIn { 0% { -moz-transform:scale('+img.scale+', '+img.scale+') translate('+img.translate.x+'px, '+img.translate.y+'px); } 100% { -moz-transform:scale('+scale+', '+scale+') translate('+targetPosition.x+'px, '+targetPosition.y+'px); }} '+
			'@-webkit-keyframes fadeIn { 0% { -webkit-transform:scale('+img.scale+', '+img.scale+') translate('+img.translate.x+'px, '+img.translate.y+'px); } 100% { -webkit-transform:scale('+scale+', '+scale+') translate('+targetPosition.x+'px, '+targetPosition.y+'px); }} '+
			'@-o-keyframes fadeIn { 0% { -o-transform:scale('+img.scale+', '+img.scale+') translate('+img.translate.x+'px, '+img.translate.y+'px); } 100% { -o-transform:scale('+scale+', '+scale+') translate('+targetPosition.x+'px, '+targetPosition.y+'px); }} '+
			'.scaling{'+
				'animation-name: fadeIn; -webkit-animation-duration: .4s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
				'-ms-animation-name: fadeIn; -webkit-animation-duration: .4s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
				'-moz-animation-name: fadeIn; -webkit-animation-duration: .4s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
				'-webkit-animation-name: fadeIn; -webkit-animation-duration: .4s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
				'-o-animation-name: fadeIn; -webkit-animation-duration: .4s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
			'}'
		);

		this.images[index].className = 'scaling';
		img.translate = targetPosition;
		img.scale = scale;
	};

	box.prototype.mobileInit = function() {

		var self = this;
		var towTouch = false;
		var startPoint = { x: 0, y: 0 };
		var targetY = 0;
		var targetX = 0;
		var startDistance = 0;
		var move = false;

		// 单手操作的时候，判断是否是垂直方向
		var vertical = null;

		var hideTimer = null;

		// 手指触碰屏幕数量
		this.$marklayer.ontouchstart = function(event) {

			// samsung 不支持两只手指放大缩小，需要增加该条件
			// http://stackoverflow.com/questions/11204460/the-touchmove-event-on-android-system-transformer-prime
			// if( navigator.userAgent.match(/Android/i) ) {
				event.preventDefault();
			// }

			if (move) {
				return;
			}

			startDistance = 0;

			move = false;
			vertical = null;

			startPoint = {
				x: event.touches[0].clientX,
				y: event.touches[0].clientY
			};

			var img = self.imagesInfo[self.currentImgIndex];
			self.images[self.currentImgIndex].className = '';
			img._scale = img.scale;

			if (event.touches.length > 1) {
				towTouch = true;
			}

		};

		this.$marklayer.ontouchmove = function(event) {

			event.preventDefault();

			move = true;

			var touchA = {
						x: event.touches[0].clientX,
						y: event.touches[0].clientY
					},
					touchB = event.touches[1] ? { x: event.touches[1].clientX, y: event.touches[1].clientY } : null,
					img = self.imagesInfo[self.currentImgIndex],
					movePoint = {
						x: touchA.x - startPoint.x,
						y: touchA.y - startPoint.y
					};

			if (towTouch && touchB) {

				// 放大缩小
				var width = touchA.x - touchB.x;
				var height = touchA.y - touchB.y;

				width = width < 0 ? width * -1 : width;
				height = height < 0 ? height * -1 : height;

				var distance = width > height ? width : height;

				if (startDistance == 0) {
					startDistance = distance;
				}

				var imgWidth = (distance - startDistance)*2 + (img.width*img._scale);

				if (imgWidth <= 10) {
					imgWidth = 10;
				}

				self.scale(imgWidth);

			} else if (!towTouch) {

				movePoint = {
					x: -parseInt( (startPoint.x - touchA.x)/(img.scale || 1) ),
					y: -parseInt( (startPoint.y - touchA.y)/(img.scale || 1) )
				};

				// 目标位置
				targetX = img.translate.x + movePoint.x;
				targetY = img.translate.y + movePoint.y;

				if (img.scale === 1) {

					var _x = movePoint.x < 0 ? movePoint.x * -1 : movePoint.x;
					var _y = movePoint.y < 0 ? movePoint.y * -1 : movePoint.y;

					if (vertical === null) {
						vertical = _x > _y ? false : true;
					}

					if (vertical === false) {
						targetY = img.translate.y;
					} else if (vertical === true) {
						targetX = img.translate.x;
					}

					if (vertical === false) {

						var index = targetX > 0 ? self.currentImgIndex - 1 : self.currentImgIndex + 1
						if (self.images[index]) {
							self.images[index].parentNode.className = '';
							setCSS(self.images[index].parentNode, {
								'transform':'translate('+( -(self.clientWidth * self.currentImgIndex) + targetX + (targetX > 0 ? -30 : 30) )+'px, 0px)'
							});
						}

						self.images[self.currentImgIndex].parentNode.className = '';
						setCSS(self.images[self.currentImgIndex].parentNode, {
							'transform':'translate('+( -(self.clientWidth * self.currentImgIndex) + targetX)+'px, 0px)'
						});

						return;
					}

				}

				setCSS(self.images[self.currentImgIndex], {
					'transform':'scale('+img.scale+','+img.scale+') translate('+targetX+'px, '+targetY+'px)'
				});

			}

		};

		this.$marklayer.ontouchend = function(event) {

			if (!move) {

				if (hideTimer) {

					var img = self.imagesInfo[self.currentImgIndex];

					clearTimeout(hideTimer);

					hideTimer = null;

					self.adjustPosition(self.currentImgIndex, img.scale <= 1 ? this.clientWidth*2 : this.clientWidth);

					return;
				}

				hideTimer = setTimeout(function(){
					self.hide();
					hideTimer = null;
				}, 300);

			} else if (!towTouch && event.touches.length == 0) {

				move = false;

				var img = self.imagesInfo[self.currentImgIndex];

				if (vertical === false ) {

					var index = self.currentImgIndex;

					var toIndex = targetX > 0 ? self.currentImgIndex - 1 : self.currentImgIndex + 1;

					var css = '';

					if (self.images[toIndex]) {
						self.currentImgIndex = toIndex;

						var str = ' fadeIna { 0% { transform:'+self.images[self.currentImgIndex].parentNode.style.transform+'; } 100% { transform:translate('+-(self.clientWidth*self.currentImgIndex)+'px, 0px); }} ';

						setCSS(self.images[self.currentImgIndex].parentNode, {
							'transform':'translate('+-(self.clientWidth*self.currentImgIndex)+'px, 0px)'
						});

						css += '@keyframes' +str+ '@-ms-keyframes' + str + '@-moz-keyframes' + str + '@-webkit-keyframes' + str + '@-o-keyframes'+str+
										'.scaling1{'+
													'animation-name: fadeIna; -webkit-animation-duration: .3s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
													'-ms-animation-name: fadeIna; -webkit-animation-duration: .3s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
													'-moz-animation-name: fadeIna; -webkit-animation-duration: .3s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
													'-webkit-animation-name: fadeIna; -webkit-animation-duration: .3s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
													'-o-animation-name: fadeIna; -webkit-animation-duration: .3s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
												'}';
					}

					if (self.images[index]) {

						if (self.images[toIndex]) {
							var offset = targetX > 0 ? -30 : 30;
						} else {
							var offset = 0;
						}

						var str = ' fadeInb { 0% { transform:'+self.images[index].parentNode.style.transform+'; } 100% { transform:translate('+-(self.clientWidth*self.currentImgIndex + offset)+'px, 0px); }} ';

						setCSS(self.images[index].parentNode, {
							'transform':'translate('+-(self.clientWidth*self.currentImgIndex + offset)+'px, 0px)'
						});

						css += '@keyframes' +str+ '@-ms-keyframes' + str + '@-moz-keyframes' + str + '@-webkit-keyframes' + str + '@-o-keyframes'+str+
										'.scaling2{'+
													'animation-name: fadeInb; -webkit-animation-duration: .3s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
													'-ms-animation-name: fadeInb; -webkit-animation-duration: .3s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
													'-moz-animation-name: fadeInb; -webkit-animation-duration: .3s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
													'-webkit-animation-name: fadeInb; -webkit-animation-duration: .3s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
													'-o-animation-name: fadeInb; -webkit-animation-duration: .3s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
												'}';
					}

					addCSS(css);

					self.images[self.currentImgIndex].parentNode.className = 'scaling1';
					self.images[index].parentNode.className = 'scaling2';

				} else {
					img.translate.x = targetX;
					img.translate.y = targetY;
					self.adjustPosition();
				}

			} else if (towTouch && event.touches.length == 0) {
				towTouch = false;
				move = false;
				self.adjustPosition();
			}

		};

		this.$close.ontouchend = function(event) {
			event.preventDefault();
			self.hide();
		};

	};

	// 移动设备模式
	box.prototype.mobile = function(images, index) {

		if (typeof images === 'string') {
			images = [images];
		}

		var self = this;

		this.currentImgIndex = index;

		setCSS(this.body, { 'overflow':'hidden' });
		setCSS(this.html, { 'overflow':'hidden' });

		this.$marklayer.style.display = '';

		addCSS(
			'@keyframes fade-in { 0% { opacity:0; } 100% { opacity:1; } } '+
			'@-ms-keyframes fade-in { 0% { opacity:0; } 100% { opacity:1; } } '+
			'@-moz-keyframes fade-in { 0% { opacity:0; } 100% { opacity:1; } } '+
			'@-webkit-keyframes fade-in { 0% { opacity:0; } 100% { opacity:1; } } '+
			'@-o-keyframes fade-in { 0% { opacity:0; } 100% { opacity:1; } } '+
			'.fade-in{'+
				'animation-name: fade-in; -webkit-animation-duration: .5s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
				'-ms-animation-name: fade-in; -webkit-animation-duration: .5s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
				'-moz-animation-name: fade-in; -webkit-animation-duration: .5s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
				'-webkit-animation-name: fade-in; -webkit-animation-duration: .5s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
				'-o-animation-name: fade-in; -webkit-animation-duration: .5s; -webkit-animation-iteration-count: 1; -webkit-animation-delay: 0s; '+
			'}'
		);

		this.$marklayer.className = 'fade-in';

		var end = function() {
			self.$marklayer.removeEventListener('webkitAnimationEnd', end, false);
			self.$marklayer.className = '';
			self.$marklayer.style.display = '';
		};

		this.$marklayer.addEventListener("webkitAnimationEnd", end, false);


		for (var i = 0, max = images.length; i < max; i++) {

			var div = document.createElement('div');
			var loading = document.createElement('div');
			var img = new Image();

			setCSS(img, { 'display': 'none' });

			loading.innerHTML = 'loading';
			setCSS(loading, { 'position': 'relative', 'left': '50%', 'top': '50%', 'color': '#fff' });

			img.onload = (function(self, loading, key) {
				return function() {

					setCSS(loading, { 'display': 'none' });

					var img = self.images[key];

					var s = img.width > self.clientWidth ? self.clientWidth/img.width : 1;

					self.imagesInfo[key] = {
						img: img,
						original: { width: img.width, height: img.height },
						width: parseInt(img.width * s),
						height: parseInt(img.height * s),
						scale: 1,
						translate: { x: 0, y: 0 },
						_scale: 1
					};

					// ---------------------------------------------
					// 初始化图片的位置和尺寸比列
					var imgInfo = self.imagesInfo[key];

					if (imgInfo.height > self.clientHeight) {
						imgInfo.translate.y = (imgInfo.height/2) - self.clientHeight/2;
					}

					setCSS(img, {
						'display': '',
						'position': 'absolute',
						'width': imgInfo.width + 'px',
						'height': imgInfo.height + 'px',
						'top': '50%',
						'left': '50%',
						'margin': -(imgInfo.height/2) + 'px 0 0 '+-(imgInfo.width/2)+'px',
						'transform':'scale('+imgInfo.scale+','+imgInfo.scale+') translate('+imgInfo.translate.x+'px, '+imgInfo.translate.y+'px)'
					});

					if (key == 0) {
						self.mobileInit();
					}

				};
			}(this, loading, this.images.length));

			img.src = images[i];
			this.images.push(img);

			div.appendChild(img);
			div.appendChild(loading);

			this.$marklayer.appendChild(div);

			setCSS(div, { 'position': 'inherit', 'width': '100%', 'height': '100%', 'left': 100 * (this.images.length-1) + '%', 'top': 0, 'transform':'translate(-'+this.currentImgIndex*this.clientWidth+'px, 0px)' });
			// setCSS(div, { 'position': 'inherit', 'width': '100%', 'height': '100%', 'left': 100 * (this.images.length-1) + '%', 'top': 0, 'margin': '0 0 0 -'+this.currentImgIndex*this.clientWidth+'px' });
		}

	};

	//========================================================================

	// pc 模式
	box.prototype.pc = function(images, index) {

		if (typeof images === 'string') {
			images = [images];
		}

		this.currentImgIndex = index;

		setCSS(this.body, { 'overflow':'hidden' });
		setCSS(this.html, { 'overflow':'hidden' });

		this.$marklayer.style.display = '';
		this.$close.style.display = '';

		for (var i = 0, max = images.length; i < max; i++) {

			var div = document.createElement('div');
			var loading = document.createElement('div');
			var img = new Image();

			setCSS(div, { 'position': 'absolute', 'display':'none', 'width': '800px', 'height': '100%', 'left': '50%', 'top': 0, 'margin': '0 0 0 -400px' });

			loading.innerHTML = 'loading';
			setCSS(loading, { 'position': 'relative', 'left': '50%', 'top': '50%', 'color': '#fff' });

			setCSS(img, { 'display': 'none' });
			img.onload = (function(self, div, loading, key) {
				return function() {

					setCSS(loading, { 'display': 'none' });

					var img = self.images[key];

					var s = img.width > 800 ? 800/img.width : 1;

					self.imagesInfo[key] = {
						width: parseInt(img.width * s),
						height: parseInt(img.height * s),
						scale: 1,
						translate: { x: 0, y: 0 }
					};

					var imgInfo = self.imagesInfo[key];

					img.width = imgInfo.width;
					img.height = imgInfo.height;

					setCSS(img, {
						'position': 'absolute',
						'top': '50%',
						'left': '50%',
						'margin': -(imgInfo.height/2) + 'px' + ' 0 0 ' + -(imgInfo.width/2) + 'px',
						'transform':'scale('+imgInfo.s+','+imgInfo.s+') translate(0px, 0px)'
						// 'pointerEvents': 'none'
					});

					// 如果宽度大于高度，并且高度大于屏幕的高度，那么图片显示顶部内容
					var toTop = imgInfo.height > imgInfo.width && imgInfo.height > self.clientHeight ? true : false;

					if (toTop) {
						imgInfo.translate.y = ((imgInfo.height*imgInfo.scale - self.clientHeight)/imgInfo.scale)/2;
						setCSS(img, {
							'transform':'scale('+imgInfo.scale+','+imgInfo.scale+') translate('+imgInfo.translate.x+'px, '+imgInfo.translate.y+'px)'
						});
					}
				};
			}(this, div, loading, this.images.length));

			img.src = images[i];
			this.images.push(img);

			div.appendChild(img);
			div.appendChild(loading);

			this.$marklayer.appendChild(div);
		}

		this.pcInit();
		this.showImg(this.currentImgIndex);
	};

	box.prototype.pcInit = function() {

		var self = this;

		this.$next.onclick = function(event) {
			event.preventDefault();
			self.next();
		};

		this.$previous.onclick = function(event) {
			event.preventDefault();
			self.previous();
		};

		this.$close.onclick = function(event) {
			event.preventDefault();
			self.hide();
		};

		this.$marklayer.onclick = function(event) {
			event.preventDefault();
			// if (event.target.localName != 'img') {
				self.hide();
			// }
		};

	};

	box.prototype.showImg = function(key) {

		var current = this.images[this.currentImgIndex].parentNode;
		var goto = this.images[key].parentNode;

		setCSS(current, { 'display':'none' });
		setCSS(goto, { 'display':'' });

		setCSS(this.images[this.currentImgIndex], {
			'display': 'none'
		});

		setCSS(this.images[key], {
			'display': ''
		});

		this.currentImgIndex = key;

		this.uploadButtonPosition();
	};

	box.prototype.previous = function() {
		if (this.images[this.currentImgIndex-1]) {
			this.showImg(this.currentImgIndex-1);
		}
	};

	box.prototype.next = function() {
		if (this.images[this.currentImgIndex+1]) {
			this.showImg(this.currentImgIndex+1);
		}
	};

	box.prototype.uploadButtonPosition = function() {

		var img = this.images[this.currentImgIndex].parentNode;

		var area = {
			x: img.offsetLeft,
			y: img.offsetTop,
			width: img.clientWidth,
			height: img.clientHeight
		};

		setCSS(this.$previous, {
			'left': area.x +  'px',
			'top': area.y + (area.height/2) + 'px',
			'display': this.images[this.currentImgIndex-1] ? '' : 'none'
		});

		setCSS(this.$next, {
			'left': area.x + area.width + 'px',
			'top': area.y + (area.height/2) + 'px',
			'display': this.images[this.currentImgIndex+1] ? '' : 'none'
		});

	};

	// ----------

	var base = null;

	return function(n, index) {

		index = index || 0;

		if (!base) {
			base = new box();
			base.init();
		}

		if (device.isPC()) {
			base.pc(n, index);
		} else {
			base.mobile(n, index);
		}

	};

}());
