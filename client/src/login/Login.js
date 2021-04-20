import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import {login} from '../action/authAction';
import {useHistory} from 'react-router-dom';
import './login.css';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

const Login = (props) => {
    const { type } = props;
    let history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginData, setLoginData] = useState({});

    async function onSubmit(){
        login({ email, password, type }, function(res){
            if(res.err) alert(res.data);
            else {
                switch (res.data.authority) {
                    case 'admin':
                        return history.push('/admin/dashboard');
                    case 'customer':
                        return history.push('/customer/dashboard');
                    default:
                        return alert('Unknown authority');
                }
            }
        });
        
    }
  
    return (
        <div style={{display:'flex', height:'100vh'}}>
            <div className="login-container">
                <h1>Login</h1>
                <Form {...layout} name="nest-messages" validateMessages={validateMessages}>
                    <Form.Item
                        name={['user', 'email']}
                        label="Email"
                    
                        rules={[
                            {
                            required: true,
                            },
                        ]}
                        >
                        <Input onChange={(e)=>setEmail(e.target.value)} />
                    </Form.Item>

                    <Form.Item
                        name={['user', 'password']}
                        label="Password"
                        type="password"
                        rules={[
                            {
                            required: true,
                            },
                        ]}
                        >
                        <Input type="password" onChange={(e)=>setPassword(e.target.value)} />
                    </Form.Item>
                    
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit" onClick={onSubmit}>
                        Login
                    </Button>
                    {type === "customer" && <Link to="/customer/register" style={{marginLeft:'30px'}}>
                        <span>register</span>
                    </Link>}
                    </Form.Item>
                    
                </Form>
            </div>
        </div>
      
    );
  };

export default Login;
