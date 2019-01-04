import './index.less';

class CropInPage {
    constructor() {
        this.config = {
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
        };
    }

    init() {
        // console.log('Init');
        this.createBox();
        this.initEvent();
    }

    createBox() {
        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        const wrap = document.createElement('div');
        wrap.id = 'J_CropperMain';
        wrap.className = 'cropper-main';

        const cvs = document.createElement('canvas');
        cvs.className = 'cropper-canvas';
        cvs.width = size.width;
        cvs.height = size.height;
        cvs.innerHTML = '您的浏览器暂不支持Canvas，推荐使用Chrome浏览器';

        const resizer = document.createElement('div');
        resizer.className = 'cropper-resize';
        resizer.innerHTML = `
            <span class="J_Archor archor" data-index="0"></span>
            <span class="J_Archor archor" data-index="1"></span>
            <span class="J_Archor archor" data-index="2"></span>
            <span class="J_Archor archor" data-index="3"></span>
            <span class="J_Archor archor" data-index="4"></span>
            <span class="J_Archor archor" data-index="5"></span>
            <span class="J_Archor archor" data-index="6"></span>
            <span class="J_Archor archor" data-index="7"></span>
        `;

        const cropType = document.createElement('div');
        cropType.className = 'select-cropper-type';
        cropType.innerHTML = `
            <div>
                <div class="cropper-desc">按键盘ESC键关闭插件，【框选区域】截图时双击选区确认截图<br>截图完成后，右键“图片存储为...”即可保存截图</div>
                <input type="button" class="J_CropSelector cropper-btn cropper-fullpage" value="整页截图">
                <input type="button" class="J_CropSelector cropper-btn cropper-fullscreen" value="全屏截图">
                <input type="button" class="J_CropSelector cropper-btn cropper-select" value="框选区域">
            </div>
        `;

        const viewBox = document.createElement('div');
        viewBox.className = 'cropper-view';

        const loader = document.createElement('div');
        loader.className = 'cropper-loader';

        this.main = wrap;
        this.cropper = cvs;
        this.resizer = resizer;
        this.typeSelector = cropType;
        this.viewBox = viewBox;
        this.loader = loader;

        this.ctx = cvs.getContext('2d');
        this.ctx.fillStyle = this.config.backgroundColor;
        this.ctx.fillRect(0, 0, size.width, size.height);

        wrap.appendChild(cvs);
        wrap.appendChild(resizer);
        wrap.appendChild(cropType);
        wrap.appendChild(viewBox);
        wrap.appendChild(loader);
        document.body.appendChild(wrap);
    }

    bindMouseMove = (ev) => {
        this.end = {
            x: ev.clientX,
            y: ev.clientY
        };
        this.clearRect();
    }

    bindMouseUp = (ev) => {
        this.start = null;
        this.end = null;
        document.removeEventListener('mousemove', this.bindMouseMove, false);
        document.removeEventListener('mouseup', this.bindMouseUp, false);
    }

    clearRect() {
        if (!this.start || !this.end) {
            return;
        }
        const diffx = this.end.x - this.start.x;
        const diffy = this.end.y - this.start.y;
        const width = Math.abs(diffx);
        const height = Math.abs(diffy);
        let startx, starty;
        if (diffx < 0) {
            startx = this.end.x;
        } else {
            startx = this.start.x;
        }
        if (diffy < 0) {
            starty = this.end.y;
        } else {
            starty = this.start.y;
        }

        this.resizerBounds = {
            x: startx,
            y: starty,
            width: width,
            height: height
        };

        this.ctx.clearRect(0, 0, this.cropper.width, this.cropper.height);
        this.ctx.fillRect(0, 0, this.cropper.width, this.cropper.height);
        this.ctx.clearRect(startx, starty, width, height);
        this.resizer.style.top = starty + 'px';
        this.resizer.style.left = startx + 'px';
        this.resizer.style.width = width + 'px';
        this.resizer.style.height = height + 'px';
    }

    destory() {
        if (this.main) {
            this.main.parentNode.removeChild(this.main);
            this.main = null;
            this.cropper = null;
            this.ctx = null;
            this.resizer = null;
            this.typeSelector = null;
            this.viewBox = null;
            this.loader = null;
        }
    }

    bindDrag = (ev) => {
        this.moveEnd = {
            x: ev.clientX,
            y: ev.clientY
        };
        if (!this.resizerBounds) {
            return;
        }
        const target = this.resizeTarget;
        const movex = this.moveEnd.x - this.moveStart.x;
        const movey = this.moveEnd.y - this.moveStart.y;
        this.moveStart = {
            x: this.moveStart.x + movex,
            y: this.moveStart.y + movey
        };
        const bounds = this.resizerBounds;
        if (target.classList.contains('J_Archor')) {
            const idx = target.getAttribute('data-index');
            switch(idx) {
                case '0':
                    this.start = {
                        x: bounds.x + movex,
                        y: bounds.y + movey
                    };
                    this.end = {
                        x: this.start.x + bounds.width - movex,
                        y: this.start.y + bounds.height - movey
                    };
                    break;
                case '2':
                    this.start = {
                        x: bounds.x,
                        y: bounds.y + movey
                    };
                    this.end = {
                        x: this.start.x + bounds.width + movex,
                        y: this.start.y + bounds.height - movey
                    };
                    break;
                case '5':
                    this.start = {
                        x: bounds.x + movex,
                        y: bounds.y
                    };
                    this.end = {
                        x: this.start.x + bounds.width - movex,
                        y: this.start.y + bounds.height + movey
                    };
                    break;
                case '7':
                    this.start = {
                        x: bounds.x,
                        y: bounds.y
                    };
                    this.end = {
                        x: this.start.x + bounds.width + movex,
                        y: this.start.y + bounds.height + movey
                    };
                    break;
                case '1':
                    this.start = {
                        x: bounds.x,
                        y: bounds.y + movey
                    };
                    this.end = {
                        x: this.start.x + bounds.width,
                        y: this.start.y + bounds.height - movey
                    };
                    break;
                case '6':
                    this.start = {
                        x: bounds.x,
                        y: bounds.y
                    };
                    this.end = {
                        x: this.start.x + bounds.width,
                        y: this.start.y + bounds.height + movey
                    };
                    break;
                case '3':
                    this.start = {
                        x: bounds.x + movex,
                        y: bounds.y
                    };
                    this.end = {
                        x: this.start.x + bounds.width - movex,
                        y: this.start.y + bounds.height
                    };
                    break;
                case '4':
                    this.start = {
                        x: bounds.x,
                        y: bounds.y
                    };
                    this.end = {
                        x: this.start.x + bounds.width + movex,
                        y: this.start.y + bounds.height
                    };
                    break;
            }
        } else {
            this.start = {
                x: bounds.x + movex,
                y: bounds.y + movey
            };
            this.end = {
                x: this.start.x + bounds.width,
                y: this.start.y + bounds.height
            };
        }
        this.clearRect();
    }

    bindDragEnd = () => {
        this.moveStart = null;
        this.moveEnd = null;
        this.resizeTarget = null;
        document.removeEventListener('mousemove', this.bindDrag, false);
        document.removeEventListener('mouseup', this.bindDragEnd, false);
    }

    crop(params) {
        let querys = [];
        this.main.className = 'cropper-main loading';
        params = params || {};
        for (let key in params) {
            querys.push(key + '=' + params[key]);
        }
        const img = new Image();
        img.src = `http://39.96.76.88:3002/crop?${querys.join('&')}`;
        img.addEventListener('load', () => {
            const width = img.width;
            const height = img.height;
            if (width > height) {
                img.style.maxWidth = '80%';
            } else {
                img.style.maxHeight = '80%';
            }
            this.main.className = 'cropper-main view';
            this.viewBox.innerHTML = '';
            this.viewBox.appendChild(img);
        });
    }

    initEvent() {
        window.addEventListener('resize', () => {
            this.destory();
        }, false);

        window.addEventListener('keyup', (ev) => {
            if (ev.keyCode === 27) { // Esc
                this.destory();
            }
        }, false);

        this.main.addEventListener('mousedown', (ev) => {
            this.start = {
                x: ev.clientX,
                y: ev.clientY
            };
            document.addEventListener('mousemove', this.bindMouseMove, false);
            document.addEventListener('mouseup', this.bindMouseUp, false);
        }, false);

        this.resizer.addEventListener('mousedown', (ev) => {
            ev.stopPropagation();
            this.moveStart = {
                x: ev.clientX,
                y: ev.clientY
            };
            this.resizeTarget = ev.target;
            document.addEventListener('mousemove', this.bindDrag, false);
            document.addEventListener('mouseup', this.bindDragEnd, false);
        }, false);

        this.typeSelector.addEventListener('click', (ev) => {
            const target = ev.target;
            if (target.classList.contains('J_CropSelector')) {
                if (target.classList.contains('cropper-fullpage')) {
                    const params = {
                        src: encodeURIComponent(location.href),
                        // src: encodeURIComponent('https://jd.com'),
                        renderWidth: window.innerWidth,
                        fullscreen: 1,
                        holdTime: 1
                    };
                    this.crop(params);
                } else if (target.classList.contains('cropper-fullscreen')) {
                    const params = {
                        src: encodeURIComponent(location.href),
                        // src: encodeURIComponent('https://jd.com'),
                        renderWidth: window.innerWidth,
                        x: document.body.scrollLeft,
                        y: document.body.scrollTop,
                        width: window.innerWidth,
                        height: window.innerHeight,
                    };
                    this.crop(params);
                } else {
                    this.main.className = 'cropper-main select';
                }
            }
        }, false);

        this.resizer.addEventListener('dblclick', (ev) => {
            const bst = document.body.scrollTop;
            const bsl = document.body.scrollLeft;
            const cropParams = {
                x: bsl + this.resizerBounds.x,
                y: bst + this.resizerBounds.y,
                width: this.resizerBounds.width,
                height: this.resizerBounds.height,
                src: encodeURIComponent(location.href),
                // src: 'https://jd.com',
                holdTime: 1,
                renderWidth: window.innerWidth
            };
            this.crop(cropParams);
        }, false);
    }
}

export default CropInPage;
