import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import "./Login.scss";
import {Link} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import {
    Card,
    CardHeader,
    CardTitle,
    CardImg,
    CardBody,
    CardFooter,
    Button,
    Form,
    FormGroup,
    FormInput,
    Alert
} from "shards-react";

class Login extends Component {
    state = {
        userName: "",
        userPassword: "",
        loading: false,
        submitted: false
    };


    componentWillMount() {
    }

    componentDidMount() {
        const userStr = localStorage.getItem('user_data');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user) {
                    this.props.history.push("/admin/dashboard");
                }
            } catch (e) {

            }
        }
    }

    doLogin = () => {
        this.setState({submitted: true});
        const {userName, userPassword} = this.state;
        const {dispatch} = this.props;
        if (userName && userPassword) {
            dispatch(actions.doLogin({
                email: userName,
                password: userPassword
            })).then(() => {
                setTimeout(() => {
                    const {loginStatus} = this.props;
                    if (loginStatus === 1) {
                        this.props.history.push("/admin/dashboard");
                    }
                }, 500);
            });
        }
    }

    render() {
        const {loginStatus, user, loginError} = this.props;

        return (
            <LoadingOverlay
                active={loginStatus == -1}
                spinner
                text='Logging In'
            >
                <div className="login-page-container">
                    <Card title="Login" className="login-card">
                        <CardHeader><h3>Login to admin panel</h3></CardHeader>
                        <CardBody>

                            {
                                loginStatus == 0 && (
                                    <Alert theme="danger">{loginError}</Alert>
                                )
                            }
                            {
                                loginStatus == 1 && (
                                    <Alert theme="success">Login Success</Alert>
                                )
                            }
                            <Form>
                                <FormGroup>
                                    <label htmlFor="username">Username</label>
                                    <FormInput
                                        id="username"
                                        type={'email'}
                                        value={this.state.userName}
                                        onChange={(e) => this.setState({userName: e.target.value})}
                                    />

                                    {
                                        (this.state.submitted && !this.state.userName) && (
                                            <div className={'input-error'}>
                                                Username is required
                                            </div>
                                        )
                                    }
                                </FormGroup>
                                <FormGroup>
                                    <label htmlFor="username">Password</label>
                                    <FormInput id="username"
                                               type={"password"}
                                               value={this.state.userPassword}
                                               onChange={(e) => this.setState({userPassword: e.target.value})}/>
                                    {
                                        (this.state.submitted && !this.state.userPassword) && (
                                            <div className={'input-error'}>
                                                Password is required
                                            </div>
                                        )
                                    }
                                </FormGroup>
                            </Form>


                        </CardBody>
                        <CardFooter>
                            <Button block squared theme="secondary" onClick={() => {
                                this.doLogin();
                            }}>
                                Login
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </LoadingOverlay>

        );
    }
}

const mapStateToProps = (state) => {
    const {loginStatus, user, error} = state.user;
    return {
        loginStatus,
        user,
        loginError: error
    };
}

export default connect(mapStateToProps)(Login);
