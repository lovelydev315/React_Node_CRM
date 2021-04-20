import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Welcome from './welcome/Welcome';
import Login from './login/Login';
import Register from './register/Register';
import Logout from './logout/Logout';
import Dashboard from './dashboard/Dashboard';
import AdminHome from './admin/AdminHome';
import AdminProgress from './admin/AdminProgress';
import AdminDocument from './admin/AdminDocument';
import './App.css';
import 'antd/dist/antd.css';  

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Welcome />
          </Route>
          <Route exact path="/admin/login">
            <Login type = "admin" />
          </Route>
          <Route exact path="/customer/login">
            <Login type = "customer" />
          </Route>
          <Route exact path="/customer/register">
            <Register />
          </Route>
          <Route exact path="/logout">
            <Logout />
          </Route>
          <Route exact path="/logout">
            <Logout />
          </Route>
          <Route exact path="/customer/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/admin/dashboard">
            <AdminHome />
          </Route>
          <Route exact path="/admin/progress">
            <AdminProgress />
          </Route>
          <Route exact path="/admin/document">
            <AdminDocument />
          </Route>
        </Switch>
        
      </Router>
    </div>
  );
}

export default App;
