import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
    Route,
    Switch,
    BrowserRouter,
} from 'react-router-dom';
import {
    CSSTransition,
    TransitionGroup
} from 'react-transition-group';
import Spin from "./pages/Spin/Spin";
import Form from "./pages/Form/Form";
import Login from "./pages-admin/Login/Login";
import Dashboard from "./pages-admin/Dashboard/Dashboard";
import FormList from "./pages-admin/FormList/FormList";
import DocumentMeta from 'react-document-meta';

const supportsHistory = 'pushState' in window.history;

function App() {
    const meta = {
        meta: {
          charset: 'utf-8',
          name: {
            viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0'
          }
        }
      };
    return (
        <DocumentMeta {...meta}>
        <div className="App">
            <BrowserRouter forceRefresh={!supportsHistory}>
                <Route
                    render={({location}) => {
                        const {pathname} = location;
                        return (
                            <TransitionGroup>
                                <CSSTransition
                                    key={pathname}
                                    classNames="page"
                                    timeout={{
                                        enter: 1000,
                                        exit: 1000,
                                    }}
                                >
                                    <Route
                                        location={location}
                                        render={() => (
                                            <Switch>
                                                <Route
                                                    exact
                                                    path="/"
                                                    component={Spin}
                                                />
                                                <Route
                                                    exact
                                                    path="/form"
                                                    component={Form}
                                                />
                                                <Route
                                                    path="/admin/login"
                                                    component={Login}
                                                />
                                                <Route
                                                    path="/admin/dashboard"
                                                    component={Dashboard}
                                                />
                                                <Route
                                                    path="/admin/form-list"
                                                    component={FormList}
                                                />
                                            </Switch>
                                        )}
                                    />
                                </CSSTransition>
                            </TransitionGroup>
                        );
                    }}
                />
            </BrowserRouter>
        </div>
        </DocumentMeta>
    );
}

export default App;
