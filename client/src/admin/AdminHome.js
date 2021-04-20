import React, { useState, useEffect } from 'react';
import {Col, Row, Button, message } from 'antd';
import {useHistory} from 'react-router-dom';

import Sidebar from '../sidebar/Sidebar';
import ProgressCard from './ProgressCard';
import DocumentRow from './DocumentRow';

import { getFolder } from '../action/documentAction';
import { isAuth, getUsers } from '../action/authAction';
import { color } from '../config/config';
import SearchInput from './SearchInput.js';
import AdminSubHeader from './AdminSubHeader.js';

import './admin.css';

const AdminHome = () => {
    let history = useHistory();
    const [ expand, setExpand ] = useState(-1);
    const [ folders, setFolders ] = useState([]);
    const [ authority, setAuthority ] = useState('');
    const [users, setUsers] = useState([]);
    useEffect(() => {
        isAuth((res) => {
            if(!res.err) {
                if (res.data.authority != "admin") {
                    message.warn("You don't have permission to enter this page.")
                    history.push('/');
                    
                }
                else setAuthority(res.data.authority);
            }
            else {
                message.warn("Unauthorized.")
                history.push('/');
            }
        });
        getUsers(function(res){
            console.log(res.data)
                setUsers(res.data);
            
        });
        getFolder(function(res){
            if(!res.err) setFolders(res.data);
            else alert(res.data);
        });
    }, [])
    function toggleExpand(index) {
        if(index === expand) setExpand(-1);
        else setExpand(index);
    }
    return (
            <Row>
                <Col span={4} style={{paddingLeft: "20px"}}>
                    <Sidebar authority={authority} />
                </Col>
                <Col span={20} className="admin-container" style={{backgroundColor: color.background}}>
                    <Row style={{marginBottom: "20px"}}>
                        <Col span={2}></Col>
                        <Col span={4}><h1 className="admin-title">Dashboard</h1></Col>
                        <Col span={10}>
                            <SearchInput />
                        </Col>
                        <Col span={3}><Button className="admin-header-button disabled">Export</Button></Col>
                        <Col span={3}><Button className="admin-header-button" style={{background: color.main}}>+ Add</Button></Col>
                        <Col span={2}></Col>
                    </Row>
                    <Row>
                        <Col span={2}></Col>
                        <Col span={15}>
                            <AdminSubHeader title="Progress" to="/admin/progress" />
                            <div className="admin-progress-container">
                                {/* {
                                    users.map((item, index)=>(
                                        index < 4 &&
                                        <ProgressCard key={index} index={index+1} userInfo={item} />
                                    ))
                                } */}
                                <Row style={{width:'100%'}} gutter={[40,40]}>
                                    {
                                        users.map((item, index)=>(
                                            index < 4 &&
                                            <Col sm={6} xs={12} key={index}>
                                                <ProgressCard key={index} index={index+1} userInfo={item} />
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </div>
                        </Col>
                        <Col span={5} style={{paddingLeft:'20px', paddingBottom:'20px'}}>
                            <div className="admin-recent-activity-container">
                                <AdminSubHeader title="Recent Activity" to="/admin/recent" />
                            </div>
                            
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                    <Row>
                        <Col span={2}></Col>
                        <Col span={20} style={{backgroundColor:'white'}}>
                            <AdminSubHeader title="Document" to="/admin/document" />
                            <p style={{margin: "10px 10%", textAlign: "left", color: "gray"}}>client</p>
                            <div className="admin-document-container">
                                {
                                    users.map((item, index)=>(
                                        index < 4 &&
                                        <DocumentRow key={index} folders={folders.map(each => {if(each.user_id === item._id) return each})} name={item.name} alter="Jeff Baker" date={item.created_at.substring(0,10) + " " + item.created_at.substring(11,16)} state={item.user_state} phase={item.phases[item.user_state.phase]} avatar={item.avatar} index = {index} expand={expand} toggleExpand={toggleExpand} />
                                    ))
                                }
                                
                            </div>
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                </Col>
                
            </Row>
      
    );
  };

export default AdminHome;