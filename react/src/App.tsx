import React, { useEffect, useState } from "react";
import { Button, Layout, Menu, message } from 'antd';
import 'antd/dist/reset.css';
import { useNavigate } from 'react-router-dom';
import {
  Routes,
  Route,
  Navigate 
} from "react-router-dom";
import CreateAccount from "./pages/CreateAccount/CreateAccount";
import Login from "./pages/Login/Login";
import { getCookieEmail as getCookieAccount, loginAccount, logoutAccount } from "./util/api";
import Home from "./pages/Home/Home";
import MyAccount from "./pages/MyAccount/MyAccount";
import MyCourses from "./pages/Courses/Courses";
import CreateCourse from "./pages/CreateCourse/CreateCourse";
import Courses from "./pages/Courses/Courses";
import Favourites from "./pages/Favourites/Favourites";
import Comments from "./pages/Comments/Comments";
const { Header, Content, Footer } = Layout;

function App() {
  const [loading, setLoading]: [any, any] = useState(true);
  const [email, setEmail]: [any, any] = useState(null);
  const [phoneNumber, setPhoneNumber]: [any, any] = useState(null);
  // const [favourites, setFavourites]: [any, any] = useState(null);
  const [name, setName]: [any, any] = useState(null);
  const [password, setPassword]: [any, any] = useState(null);

  const navigate = useNavigate();

  const login = async (email, password, rememberMe) => {
    const account = await loginAccount(email, password, rememberMe);
    if (account) {
      const { phoneNumber, name, favourites } = account;
      setEmail(email);
      setPhoneNumber(phoneNumber);
      setName(name);
      // setFavourites(favourites);
      navigate('/home')
    }
  }

  const logout = async () => {
    const loggedOut = await logoutAccount();
    if (loggedOut) {
      setEmail(null);
      setPhoneNumber(null);
      setName(null);
      // setFavourites(null);
      navigate('/login')
    }
  }

  useEffect(() => {
    const getCookieUser = async () => {
      const { email, phoneNumber, name, favourites } = await getCookieAccount();
      console.log({ email, phoneNumber, name, favourites })
      if (email) {
        setEmail(email)
        setPhoneNumber(phoneNumber);
        setName(name);
        // setFavourites(favourites);
      }
      setLoading(false);

    }
    getCookieUser();
  }, [])


  const selectedKey = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] || 'home'

  const items = email
    ? [
      {
        key: 'courses',
        label: 'Courses'
      },
      {
        key: 'favourites',
        label: 'Favourites'
      },
      {
        key: 'account',
        label: 'My Account'
      },

    ]
    : [
      {
        key: 'login',
        label: 'Login'
      },
      {
        key: 'createAccount',
        label: 'Create Account'
      }
    ]

    if (loading) {
      return <div />
    }

  return (
    <Layout>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          onClick={({ item, key, keyPath, domEvent }) => {
            navigate(`/${key}`)
          }}
          selectedKeys={[selectedKey]}
          items={items}
        />
      </Header>
      <div style={{ paddingLeft: 50, marginTop: 15}}>
      {email 
        ? <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "right"}}>
            <div> Logged in as {email}</div> 
            <Button type="primary" size="small" onClick={logout} style={{ marginLeft: 10, marginRight: 10 }}>
              Logout
            </Button>      
          </div>
        : 
        <div style={{ paddingTop: 24 }}/>}
      </div>

      <Content style={{ width: 'calc(100% - 40px)', marginTop: 15, marginLeft: 30, marginRight: 30, paddingLeft: 20, paddingRight: 20, paddingTop: 20, 
      minHeight: 'calc(100vh - 182px)', 
      maxHeight: 'calc(100vh - 182px)', 
      background: '#fff', overflowY: 'scroll' 
      }}>
        <Routes>
          {
            email
              ? [
                <Route 
                  path="/account" 
                  element={
                    <MyAccount 
                      email={email}
                      phoneNumber={phoneNumber}
                      setPhoneNumber={setPhoneNumber}
                      name={name}
                      setName={setName}
                      navigate={navigate}
                    />
                  } 
                />,
                <Route 
                  path="/courses" 
                  element={
                    <Courses 
                    navigate={navigate} 
                    email={email}
                    
                    />
                  } 
                />,
                <Route 
                path="/favourites" 
                element={
                  <Favourites 
                  navigate={navigate} 
                  email={email}
                  
                  />
                } 
                />,
                <Route 
                path="/courses/:id/comments" 
                element={
                  <Comments 
                  navigate={navigate} 
                  email={email}
                  
                  />
                } 
              />,
                <Route 
                  path="/courses/create/:id" 
                  element={
                    <CreateCourse email={email} navigate={navigate} />
                  } 
              />,
                <Route path="*" 
                  element={<Navigate to='/courses' />} 
              />
              ]
              : [
                <Route 
                path="/createAccount" 
                element={
                  <CreateAccount 
                   // @ts-ignore
                    navigate={navigate}
                  />
                } 
              />,
                <Route path="/login" 
                  element={
                    <Login 
                    login={login}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    />
                  } 
                />,
                <Route path="*" 
                  element={<Navigate to='/login' />
                } 
                />
              ]
          }
       
     
        </Routes>

      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Created for INFS3202 by Campbell Timm
        </Footer>
    </Layout>
  );
}

export default App;
