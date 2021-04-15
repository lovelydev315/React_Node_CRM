import React from 'react';
import { Divider } from 'antd';
import { Card } from 'antd';
import { Avatar } from 'antd';
import { useHistory } from "react-router-dom";

import './welcome.css';

const { Meta } = Card;


function Welcome() {
    let history = useHistory();

    function toLogin(type){
        history.push('/' + type + '/login');
    }

    return (
        <div className="welcome-div">
            <div className="welcome-container">
                <Card
                    onClick = { () => toLogin('admin') }
                    hoverable
                    className = "welcome-card"
                    cover={
                        <Avatar 
                            className="welcome-avatar" 
                            size={140} 
                            icon={<img className="user-image" src={process.env.PUBLIC_URL+'/user_icon.png'} />} 
                        />
                    }
                >
                    <h1 className="welcome-avatar-text">Admin</h1>
                    <h5 className="welcome-avatar-button">ENTER</h5>
                </Card>

                <Card
                    onClick={() => toLogin('customer')}
                    hoverable
                    className = "welcome-card"
                    cover={
                        <Avatar 
                            className="welcome-avatar"  
                            size={140} 
                            icon={<img className="user-image" src={process.env.PUBLIC_URL+'/user_icon.png'} />} />
                    }
                >
                    <h1 className="welcome-avatar-text">User</h1>
                    <h5 className="welcome-avatar-button">ENTER</h5>
                </Card>
            </div>
        </div>
    );
    
}

export default Welcome;
