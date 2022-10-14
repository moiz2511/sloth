import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage';
import "../Spin/Spin.scss";
import {apiUrl, formProducts} from "../../constants";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import {
    FormCheckbox,
    FormInput,
    Container,
    Row,
    Col,
    Button,
    Alert, CardBody
} from "shards-react";
import $ from "jquery";
import LoadingOverlay from "react-loading-overlay";
import {submitFormData} from "../../actions";

const SLOTS_PER_REEL = 12;
// radius = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / SLOTS_PER_REEL ) );
// current settings give a value of 149, rounded to 150
let REEL_RADIUS = 500;
let checkboxwait = false;

class Form extends Component {
    state = {
        affiliatedWithNapaStore: false,
        anInstallerCustomer: false,

        fullName: "",
        emailAddress: "",

        storeNumber: "",
        servicingDC: "",
        storeName: "",
        storeAddress: "",

        businessName: "",
        businessAddress: "",

        oeTurboPowerTurboChargers: false,
        napaStartersAndAlternators: false,
        napaPowerSport: false,
        wilson: false,
        premiumNapaSteering: false,
        napaNewSteering: false,
        formErrors: null,

        isShowForm: true,
    };


    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps, nextContext) {

    }

    componentWillMount() {

        window.addEventListener('orientationchange', this.setScreenOrientation);
        this.setScreenOrientation();
    }

    setScreenOrientation = () => {
        if (window.matchMedia("(orientation: portrait)").matches) {
            console.log('orientation: portrait');
            if (window.innerWidth <= 319) {
                REEL_RADIUS = 105;
            } else if (window.innerWidth >= 320 && window.innerWidth <= 400) {
                REEL_RADIUS = 120;
            } else if (window.innerWidth >= 401 && window.innerWidth <= 767) {
                REEL_RADIUS = 150;
            } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
                REEL_RADIUS = 300;
            } else if (window.innerWidth >= 1025) {
                REEL_RADIUS = 800;
            }
        }

        if (window.matchMedia("(orientation: landscape)").matches) {
            console.log('orientation: landscape');
            if (window.innerHeight <= 319) {
                REEL_RADIUS = 105;
            } else if (window.innerHeight >= 320 && window.innerHeight <= 400) {
                REEL_RADIUS = 120;
            } else if (window.innerHeight >= 401 && window.innerHeight <= 767) {
                REEL_RADIUS = 300;
            } else if (window.innerHeight >= 768 && window.innerHeight <= 1024) {
                REEL_RADIUS = 300;
            } else if (window.innerHeight >= 1025) {
                REEL_RADIUS = 800;
            }
        }
    }

    componentDidMount() {

    }


    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    submitUserData = () => {

        const {affiliatedWithNapaStore, anInstallerCustomer, fullName, emailAddress} = this.state;
        const {storeNumber, servicingDC, storeName, storeAddress} = this.state;
        const {businessName, businessAddress} = this.state;
        const {oeTurboPowerTurboChargers, napaStartersAndAlternators, napaPowerSport, wilson, premiumNapaSteering, napaNewSteering} = this.state;


        var errors = {};

        if (!fullName) {
            errors['name'] = "Full name is required";
        }
        if (!emailAddress) {
            errors['email'] = "Email address is required";
        } else if (!this.validateEmail(emailAddress)) {
            errors['email'] = "Email address is not valid";
        }

        if (affiliatedWithNapaStore) {
            if (!storeNumber) {
                errors['store_number'] = "Store number is required";
            }
            if (!servicingDC) {
                errors['servicing_dc'] = "Servicing DC is required";
            }
            if (!storeName) {
                errors['store_name'] = "Store name is required";
            }
            if (!storeAddress) {
                errors['store_address'] = "Store address is required";
            }
        } else if (anInstallerCustomer) {
            if (!businessName) {
                errors['business_name'] = "Business name is required";
            }
            if (!businessAddress) {
                errors['business_address'] = "Business address is required";
            }
        } else {
            errors['user_type'] = "Select who are you?";
        }


        if (Object.keys(errors).length == 0) {
            let postData = {
                user_type: affiliatedWithNapaStore ? 'affiliated_with_napa_store' : 'installer_customer',
                name: fullName,
                email: emailAddress,
            };
            if (affiliatedWithNapaStore) {
                postData['store_number'] = storeNumber;
                postData['servicing_dc'] = servicingDC;
                postData['store_name'] = storeName;
                postData['store_address'] = storeAddress;
            } else if (anInstallerCustomer) {
                postData['business_name'] = businessName;
                postData['business_address'] = businessAddress;
            }

            let products = [];
            if (oeTurboPowerTurboChargers) {
                products.push(formProducts.oeTurboPowerTurboChargers);
            }
            if (napaStartersAndAlternators) {
                products.push(formProducts.napaStartersAndAlternators);
            }
            if (napaPowerSport) {
                products.push(formProducts.napaPowerSport);
            }
            if (wilson) {
                products.push(formProducts.wilson);
            }
            if (premiumNapaSteering) {
                products.push(formProducts.premiumNapaSteering);
            }
            if (napaNewSteering) {
                products.push(formProducts.napaNewSteering);
            }

            postData['products_buying'] = products.join("|");

            const {dispatch} = this.props;
            dispatch(actions.submitFormData(postData)).then(() => {
                setTimeout(() => {
                    const {dataAddingStatus} = this.props;
                    if (dataAddingStatus === 1) {
                        this.setState({
                            //isShowForm: true,

                            affiliatedWithNapaStore: false,
                            anInstallerCustomer: false,

                            fullName: "",
                            emailAddress: "",

                            storeNumber: "",
                            servicingDC: "",
                            storeName: "",
                            storeAddress: "",

                            businessName: "",
                            businessAddress: "",

                            oeTurboPowerTurboChargers: false,
                            napaStartersAndAlternators: false,
                            napaPowerSport: false,
                            wilson: false,
                            premiumNapaSteering: false,
                            napaNewSteering: false,
                            formErrors: null,
                        });
                    }
                }, 500);
            });
        } else {
            this.setState({formErrors: errors});
        }
    }

    handleProductChange = (e, product) => {
        if (!checkboxwait) {
            checkboxwait = true;
            const newState = {};
            newState[product] = !this.state[product];
            this.setState({...this.state, ...newState});
            setTimeout(() => {
                checkboxwait = false;
            }, 200);
        }
    }

    render() {
        const {dataAddingStatus, dataAddingError} = this.props;

        return (
            <LoadingOverlay
                active={dataAddingStatus == -1}
                spinner
                text='Connecting....'
            >
                <div className="spin-page-container">
                    <div className={'slot-machine-container'}>

                        <img
                            className={'spin-bg-image'}
                            style={{opacity: 1}}
                            src={'images/spinbackground.png'}/>

                    </div>

                    {
                        this.state.isShowForm && (
                            <div className="container">
                                <div className={'form-container'}>
                                    <Container className={'heading-form'}>
                                        <Row>
                                            <Col>
                                                <div className={'heading1'}>PRE-QUALIFY FOR THE</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className={'heading2'}>BIG RACE</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <h4 className={'heading3'}>
                                                    To begin, please answer a few simple questions:
                                                </h4>
                                            </Col>
                                        </Row>

                                    </Container>
                                    <Container className={'option-form'}>
                                        <Row>
                                            <Col>
                                                <div className={'heading4'}>
                                                    ARE YOU AFFILIATED WITH A NAPA STORE OR ARE YOU AN INSTALLER CUSTOMER?
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.affiliatedWithNapaStore}
                                                    onChange={e => {
                                                        this.setState({
                                                            affiliatedWithNapaStore: true,
                                                            anInstallerCustomer: false
                                                        });
                                                    }}
                                                >NAPA store</FormCheckbox>
                                            </Col>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.anInstallerCustomer}
                                                    onChange={e => {
                                                        this.setState({
                                                            affiliatedWithNapaStore: false,
                                                            anInstallerCustomer: true
                                                        });
                                                    }}
                                                >
                                                    Installer customer
                                                </FormCheckbox>
                                            </Col>
                                        </Row>

                                        {
                                            (this.state.formErrors && this.state.formErrors['user_type']) && (
                                                <Row>
                                                    <Col sm={12}>
                                                        <div className={'input-error'}>
                                                            {this.state.formErrors['user_type']}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            )
                                        }

                                    </Container>


                                    <Container className={'input-form'}>
                                        <Row>
                                            <Col sm={12} md={3}>
                                                <span className={'input-label'}>Full Name</span>
                                            </Col>
                                            <Col sm={12} md={9}>
                                                <FormInput
                                                    className="input-field"
                                                    value={this.state.fullName}
                                                    onChange={(e) => this.setState({fullName: e.target.value})}
                                                />
                                            </Col>
                                        </Row>
                                        {
                                            (this.state.formErrors && this.state.formErrors['name']) && (
                                                <Row>
                                                    <Col sm={12} md={3}></Col>
                                                    <Col sm={12} md={9}>
                                                        <div className={'input-error'}>
                                                            {this.state.formErrors['name']}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            )
                                        }

                                        <Row>
                                            <Col sm={12} md={3}>
                                                <span className={'input-label'}>Email Address</span>
                                            </Col>
                                            <Col sm={12} md={9}>
                                                <FormInput
                                                    className="input-field"
                                                    type={"email"}
                                                    value={this.state.emailAddress}
                                                    onChange={(e) => this.setState({emailAddress: e.target.value})}
                                                />
                                            </Col>
                                        </Row>
                                        {
                                            (this.state.formErrors && this.state.formErrors['email']) && (
                                                <Row>
                                                    <Col sm={12} md={3}></Col>
                                                    <Col sm={12} md={9}>
                                                        <div className={'input-error'}>
                                                            {this.state.formErrors['email']}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            )
                                        }

                                        {
                                            this.state.affiliatedWithNapaStore && (
                                                <React.Fragment>
                                                    <Row>
                                                        <Col sm={12} md={3}>
                                                            <span className={'input-label'}>Store number</span>
                                                        </Col>
                                                        <Col sm={12} md={9}>
                                                            <FormInput
                                                                className="input-field"
                                                                value={this.state.storeNumber}
                                                                onChange={(e) => this.setState({storeNumber: e.target.value})}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {
                                                        (this.state.formErrors && this.state.formErrors['store_number']) && (
                                                            <Row>
                                                                <Col sm={12} md={3}></Col>
                                                                <Col sm={12} md={9}>
                                                                    <div className={'input-error'}>
                                                                        {this.state.formErrors['store_number']}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    }


                                                    <Row>
                                                        <Col sm={12} md={3}>
                                                            <span className={'input-label'}>Servicing DC</span>
                                                        </Col>
                                                        <Col sm={12} md={9}>
                                                            <FormInput
                                                                className="input-field"
                                                                value={this.state.servicingDC}
                                                                onChange={(e) => this.setState({servicingDC: e.target.value})}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {
                                                        (this.state.formErrors && this.state.formErrors['servicing_dc']) && (
                                                            <Row>
                                                                <Col sm={12} md={3}></Col>
                                                                <Col sm={12} md={9}>
                                                                    <div className={'input-error'}>
                                                                        {this.state.formErrors['servicing_dc']}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    }

                                                    <Row>
                                                        <Col sm={12} md={3}>
                                                            <span className={'input-label'}>Store Name</span>
                                                        </Col>
                                                        <Col sm={12} md={9}>
                                                            <FormInput
                                                                className="input-field"
                                                                value={this.state.storeName}
                                                                onChange={(e) => this.setState({storeName: e.target.value})}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {
                                                        (this.state.formErrors && this.state.formErrors['store_name']) && (
                                                            <Row>
                                                                <Col sm={12} md={3}></Col>
                                                                <Col sm={12} md={9}>
                                                                    <div className={'input-error'}>
                                                                        {this.state.formErrors['store_name']}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    }

                                                    <Row>
                                                        <Col sm={12} md={3}>
                                                            <span className={'input-label'}>Store Address</span>
                                                        </Col>
                                                        <Col sm={12} md={9}>
                                                            <FormInput
                                                                className="input-field"
                                                                value={this.state.storeAddress}
                                                                onChange={(e) => this.setState({storeAddress: e.target.value})}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {
                                                        (this.state.formErrors && this.state.formErrors['store_address']) && (
                                                            <Row>
                                                                <Col sm={12} md={3}></Col>
                                                                <Col sm={12} md={9}>
                                                                    <div className={'input-error'}>
                                                                        {this.state.formErrors['store_address']}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    }
                                                </React.Fragment>
                                            )
                                        }


                                        {
                                            this.state.anInstallerCustomer && (
                                                <React.Fragment>
                                                    <Row>
                                                        <Col sm={12} md={3}>
                                                            <span className={'input-label'}>Business Name</span>
                                                        </Col>
                                                        <Col sm={12} md={9}>
                                                            <FormInput
                                                                className="input-field"
                                                                value={this.state.businessName}
                                                                onChange={(e) => this.setState({businessName: e.target.value})}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {
                                                        (this.state.formErrors && this.state.formErrors['business_name']) && (
                                                            <Row>
                                                                <Col sm={12} md={3}></Col>
                                                                <Col sm={12} md={9}>
                                                                    <div className={'input-error'}>
                                                                        {this.state.formErrors['business_name']}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    }

                                                    <Row>
                                                        <Col sm={12} md={3}>
                                                            <span className={'input-label'}>Business Address</span>
                                                        </Col>
                                                        <Col sm={12} md={9}>
                                                            <FormInput
                                                                className="input-field"
                                                                value={this.state.businessAddress}
                                                                onChange={(e) => this.setState({businessAddress: e.target.value})}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {
                                                        (this.state.formErrors && this.state.formErrors['business_address']) && (
                                                            <Row>
                                                                <Col sm={12} md={3}></Col>
                                                                <Col sm={12} md={9}>
                                                                    <div className={'input-error'}>
                                                                        {this.state.formErrors['business_address']}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    }
                                                </React.Fragment>
                                            )
                                        }


                                    </Container>


                                    <Container className={'product-choose-form'}>
                                        <Row>
                                            <Col>
                                                <div className={'heading4'}>
                                                    WHAT PRODUCTS DO YOU CURRENTLY PURCHASE FROM NAPA?
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.oeTurboPowerTurboChargers}
                                                    onChange={e => {
                                                        this.handleProductChange(e, 'oeTurboPowerTurboChargers');
                                                    }}
                                                >
                                                    {formProducts.oeTurboPowerTurboChargers}
                                                </FormCheckbox>
                                            </Col>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.napaStartersAndAlternators}
                                                    onChange={e => {
                                                        this.handleProductChange(e, 'napaStartersAndAlternators');
                                                    }}
                                                >
                                                    {formProducts.napaStartersAndAlternators}
                                                </FormCheckbox>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.napaPowerSport}
                                                    onChange={e => {
                                                        this.handleProductChange(e, 'napaPowerSport');
                                                    }}
                                                >
                                                    {formProducts.napaPowerSport}
                                                </FormCheckbox>
                                            </Col>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.wilson}
                                                    onChange={e => {
                                                        this.handleProductChange(e, 'wilson');
                                                    }}
                                                >
                                                    {formProducts.wilson}
                                                </FormCheckbox>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.premiumNapaSteering}
                                                    onChange={e => {
                                                        this.handleProductChange(e, 'premiumNapaSteering');
                                                    }}
                                                >
                                                    {formProducts.premiumNapaSteering}
                                                </FormCheckbox>
                                            </Col>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.napaNewSteering}
                                                    onChange={e => {
                                                        this.handleProductChange(e, 'napaNewSteering');
                                                    }}
                                                >
                                                    {formProducts.napaNewSteering}
                                                </FormCheckbox>
                                            </Col>
                                        </Row>

                                    </Container>

                                    {
                                        dataAddingStatus == 0 && (
                                            <Alert theme="danger">{dataAddingError}</Alert>
                                        )
                                    }

                                    <Container className={'btn-view'}>
                                        <Row>
                                            <Col>
                                                <Button className={'play-btn'} pill onClick={() => {
                                                    this.submitUserData();
                                                }}>Submit</Button>
                                            </Col>
                                        </Row>
                                    </Container>

                                </div>
                            </div>
                        )
                    }


                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    const {dataAddingStatus, error} = state.form;
    return {
        dataAddingStatus,
        dataAddingError: error
    };
}

export default connect(mapStateToProps)(Form);
