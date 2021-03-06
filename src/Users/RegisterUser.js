import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Modal, message, Tooltip } from 'antd';
import { Row, Col, Spin } from 'antd';
import axios from 'axios';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

class RegisterUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconLoading: false,
            userName: '',
            password: '',
            confirmPassword: '',
            firstname: '',
            lastname: '',
            email: '',
        }
    }

    componentDidMount() {
        document.title = "Create Account";
    }

    validatePassword = () => {

        var password = this.state.password;
        var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        if (!re.test(password)) {
            var lowerChar = /^(?=.*[a-z])/;
            var number = /^(?=.*[0-9])/;
            var upperChar = /^(?=.*[A-Z])/;
            var SpecialChar = /^(?=.*[!@#\$%\^&\*])/;
            var length = /^(?=.{8,})/;
            if (!length.test(password)) {
                message.error('Your password should be atleast 8 characters long', 5);
                return false;
            }
            if (!lowerChar.test(password)) {
                message.error('Your password should contain atleast one Lower case character', 5);
                return false;
            }
            if (!number.test(password)) {
                message.error('Your password should contain atleast one Number', 5);
                return false;
            }
            if (!upperChar.test(password)) {
                message.error('Your password should contain atleast one Upper case character', 5);
                return false;
            }
            if (!SpecialChar.test(password)) {
                message.error('Your password should contain atleast one Special character', 5);
                return false;
            }
        }
        return true;
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
            return true;
        } else {
            message.error('Please provide email address to continue!', 5);
            return false;
        }
    }

    validateData = () => {

        if (this.state.userName.length === 0) {
            message.error('Please provide User Name to continue!', 5);
            return false;
        }
        if (this.state.password.length === 0) {
            message.error('Invalid password, please set Password value!', 5);
            return false;
        }
        if (this.state.confirmPassword.length === 0) {
            message.error('Invalid password, please set ConfirmPassword value!', 5);
            return false;
        }
        if (this.state.firstname.length === 0) {
            message.error('Please provide FirstName to continue!', 5);
            return false;
        }
        if (this.state.lastname.length === 0) {
            message.error('Please provide lastname to continue!', 5);
            return false;
        }
        if (!this.validateEmail(this.state.email)) {
            return false;
        }
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({
                password: '',
                confirmPassword: ''
            });
            message.error('Password and Confirm Password does not match!', 5);
            return false;
        }
        if (!this.validatePassword()) {
            return false;
        }
        return true;
    }

    createUser = () => {

        var res = this.validateData();
        if (!res) {
            //message.error('Data provided is not valid!', 3);
            return;
        }
        this.setState({ "iconLoading": true });

        var data = {
            'username': this.state.userName,
            'password': this.state.password,
            'firstname': this.state.firstname,
            'lastname': this.state.lastname,
            'email': this.state.email,
            'role': 'ROLE_USER'
        };
        var config = {
            timeout: 45000
        };
        axios.post(process.env.REACT_APP_USERMGMT_API_BASE_URL + '/public/register', data, config)
            .then((response) => {
                //console.log(response);
                this.setState({ "iconLoading": false });
                Modal.success({
                    title: 'Registration successful.',
                    content: response.data.message
                });
                this.props.closeRegisterUserView();
            })
            .catch((error) => {
                this.setState({ iconLoading: false });
            });
    }

    render() {
        return (
            //#80CBC4
            <div style={{ textAlign: "center" }}>
                <Row type="flex" justify="center" align="middle">
                    <Col>
                        <Form style={{ backgroundColor: 'white' }}>
                            <label style={{ fontSize: 15, fontWeight: 'bold' }}>Create New Account</label>
                            <br />
                            <Spin spinning={this.state.iconLoading} />
                            <br />
                            <FormItem {...formItemLayout} label="Username:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Username"
                                    value={this.state.userName}
                                    onChange={(e) => {
                                        this.setState({ userName: e.target.value })
                                    }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Password:">
                                <div>
                                    <Input.Password style={{ fontSize: 20 }} prefix={<Icon type="lock" style={{ fontSize: 20 }} />}
                                        type="password" placeholder=" Password"
                                        value={this.state.password}
                                        onBlur={this.validatePassword}
                                        onChange={(e) => {
                                            this.setState({ password: e.target.value })
                                        }} />

                                </div>
                            </FormItem>
                            <FormItem {...formItemLayout} label="Confirm Password:">
                                <Input.Password style={{ fontSize: 20 }} prefix={<Icon type="lock" style={{ fontSize: 20 }} />}
                                    type="password" placeholder=" Confirm Password"
                                    value={this.state.confirmPassword}
                                    onBlur={this.validatePassword}
                                    onChange={(e) => {
                                        this.setState({ confirmPassword: e.target.value })
                                    }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="First Name:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" First Name"
                                    value={this.state.firstname}
                                    onChange={(e) => {
                                        this.setState({ firstname: e.target.value })
                                    }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Last Name:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Last Name"
                                    value={this.state.lastname}
                                    onChange={(e) => {
                                        this.setState({ lastname: e.target.value })
                                    }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Email:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Email"
                                    value={this.state.email}
                                    onChange={(e) => {
                                        this.setState({ email: e.target.value })
                                    }} />
                            </FormItem>
                            <FormItem>
                                <Row type="flex" justify="center" align="middle">
                                    <Col>
                                        <Button type="primary" icon={'check-circle-o'}
                                            loading={this.state.iconLoading}
                                            htmlType="submit"
                                            onClick={this.createUser}>Submit</Button>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.loggedInUser
    };
}

export default connect(mapStateToProps, null)(RegisterUser);
