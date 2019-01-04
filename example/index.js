import React, { Component } from 'react';
import { render } from 'react-dom';

import CropInPage from '../';

import './index.less';

// console.log(CropInPage);

class Demo extends Component {
    constructor() {
        super();
        this.state = {
            //
        };
    }

    componentDidMount() {
        const cip = new CropInPage();
        // cip.init();
        this.cropper = cip;
    }

    startCrop = (ev) => {
        this.cropper.init();
    }

    render() {
        return (
            <div className="cw" id="J_CW">
                Demo
                <input type="button" value="截图" onClick={this.startCrop} />
            </div>
        );
    }
}

const page = document.createElement('div');
page.style.height = '100%';
document.body.appendChild(page);

render(<Demo />, page);
