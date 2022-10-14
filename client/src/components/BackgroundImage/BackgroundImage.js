import React, {Component} from 'react';
import "./BackgroundImage.css";

export default class BackgroundImage extends Component {
    render() {
        return (
            <div className={"bg-image"} style={{filter:"blur("+this.props.blur+"px)"}}></div>
        );
    }
}

BackgroundImage.defaultProps = {
    blur:1
}
