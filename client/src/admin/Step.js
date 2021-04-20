import React  from 'react';

const Step = (props) => {
    const current = props.current;
    const length = props.length;
    const height = props.height;
    const color = props.color;
    const marginTop = props.marginTop;
    const steps = [];
    for(let i = 0; i < length; i++) {
        let style = {};
        if(i < current) style.backgroundColor = color;
        if(i < length - 1) {
            if(i < current) style.borderRight = "1px solid white";
            else style.borderRight = "2px solid " + color;
        }
        style.height = "100%";
        style.width = 100/length + "%";
        if(i === 0) style.borderRadius = "9999px 0px 0px 9999px";
        if(i === length - 1)style.borderRadius = "0px 9999px 9999px 0px";
        steps.push(<div key={i} style={style}></div>)
    }
    return (
        <div className="progress-card-status-bar" style={{height: height, border: "2px solid "+color, marginTop: marginTop}}>
            {steps}
        </div>
    );
};

export default Step;