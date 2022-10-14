import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage';
import "./Spin.scss";
import {apiUrl, napaProducts} from "../../constants";
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

const SLOTS_PER_REEL = 12;
// radius = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / SLOTS_PER_REEL ) );
// current settings give a value of 149, rounded to 150
let REEL_RADIUS = 500;
let checkboxwait = false;

class Spin extends Component {
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

        city: "",
        stateName: "",
        zip: "",

        napaNewElectrical: false,
        wilson: false,
        premiumPlus: false,
        premiumSteering: false,
        powerSupport: false,
        newSteering: false,
        formErrors: null,

        isShowForm: false,

        showVideo: false,
        disableSpin: false,
        screenType: 'spin',
        items: ['item1.png', 'item2.png', 'item3.png', 'item4.png', 'item5.png']
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

    setUpSlots = () => {
        this.createSlots($('#ring1'));
        this.createSlots($('#ring2'));
        this.createSlots($('#ring3'));
    }


    createSlots = (ring) => {

        var slotAngle = 360 / SLOTS_PER_REEL;

        var seed = this.getSeed();
        seed = 2;

        for (var i = 0; i < SLOTS_PER_REEL; i++) {
            var slot = document.createElement('div');

            slot.className = 'slot';

            // compute and assign the transform for this slot
            var transform = 'rotateX(' + (slotAngle * i) + 'deg) translateZ(' + REEL_RADIUS + 'px)';

            slot.style.transform = transform;

            // setup the number to show inside the slots
            // the position is randomized to

            // var content = $(slot).append('<p>' + ((seed + i) % 12) + '</p>');
            var content = $(slot).append('<img src="./images/' + this.state.items[((seed + i) % 5)] + '" class="spin-item"/>');

            // add the poster to the row
            ring.append(slot);
        }
    }

    getSeed = () => {
        // generate random number smaller than 13 then floor it to settle between 0 and 12 inclusive
        return Math.floor(Math.random() * (SLOTS_PER_REEL));
    }

    spin = () => {
        this.setState({disableSpin: true});
        var timer = 2;
        var maxTimerDelay = 0;
        //var txt = 'seeds: ';
        for (var i = 1; i < 4; i++) {
            var oldSeed = -1;
            /*
            checking that the old seed from the previous iteration is not the same as the current iteration;
            if this happens then the reel will not spin at all
            */
            var oldClass = $('#ring' + i).attr('class');
            if (oldClass.length > 4) {
                oldSeed = parseInt(oldClass.slice(10));
                console.log(oldSeed);
            }
            var seed = this.getSeed();
            while (oldSeed == seed) {
                seed = this.getSeed();
            }

            if (this.state.screenType === "spinagainlast") {
                seed = 1;
            }

            var delay = timer + i * 0.5;
            $('#ring' + i)
                .css('animation', 'back-spin 1s, spin-' + seed + ' ' + (delay) + 's')
                .attr('class', 'ring spin-' + seed);
            console.log("delay" + delay);
            if (maxTimerDelay < delay) {
                maxTimerDelay = delay;
            }
        }
        setTimeout(() => {

            if (this.state.screenType == 'spinagain') {
                this.setState({disableSpin: false, showVideo: true, screenType: 'spinagainlast'});
                setTimeout(() => {
                    document.getElementById('trainingvideoview').play();
                }, 300);
            } else if (this.state.screenType == 'spinagainlast') {
                this.setState({disableSpin: true, screenType: 'finalscreen'});
                setTimeout(() => {
                    this.setState({disableSpin:false, isShowForm: false, screenType: 'spin'}, () => {
                        this.setUpSlots();
                    });
                    // this.submitUserData()
                }, 8 * 1000);
            } else {
                this.setState({disableSpin: false, screenType: 'spinagain'});
            }

        }, maxTimerDelay * 1000);
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    submitUserData=()=>{
        this.setState({
            isShowForm: false,
            screenType: 'spin',

            affiliatedWithNapaStore: false,
            anInstallerCustomer: false,

            fullName: "",
            emailAddress: "",

            storeNumber: "",
            servicingDC: "",
            storeName: "",
            storeAddress: "",

            city: "",
            stateName: "",
            zip: "",

            businessName: "",
            businessAddress: "",

            napaNewElectrical: false,
            wilson: false,
            premiumPlus: false,
            premiumSteering: false,
            powerSupport: false,
            newSteering: false,
            formErrors: null,
        });
    }

    // submitUserData = () => {

    //     const {affiliatedWithNapaStore, anInstallerCustomer, fullName, emailAddress, city, stateName, zip} = this.state;
    //     const {storeNumber, servicingDC, storeName, storeAddress} = this.state;
    //     const {businessName, businessAddress} = this.state;
    //     const {napaNewElectrical, wilson, premiumPlus, premiumSteering, powerSupport, newSteering} = this.state;


    //     var errors = {};

    //     if (!fullName) {
    //         errors['name'] = "Full name is required";
    //     }
    //     if (!city) {
    //         errors['city'] = "City is required";
    //     }
    //     if (!stateName) {
    //         errors['state'] = "State  is required";
    //     }
    //     if (!zip) {
    //         errors['zip'] = "Zip is required";
    //     }

    //     if (!emailAddress) {
    //         errors['email'] = "Email address is required";
    //     } else if (!this.validateEmail(emailAddress)) {
    //         errors['email'] = "Email address is not valid";
    //     }

    //     if (affiliatedWithNapaStore) {
    //         if (!storeNumber) {
    //             errors['store_number'] = "Store number is required";
    //         }
    //         if (!servicingDC) {
    //             errors['servicing_dc'] = "Servicing DC is required";
    //         }
    //         if (!storeName) {
    //             errors['store_name'] = "Store name is required";
    //         }
    //         if (!storeAddress) {
    //             errors['store_address'] = "Store street is required";
    //         }
    //     } else if (anInstallerCustomer) {
    //         if (!businessName) {
    //             errors['business_name'] = "Business name is required";
    //         }
    //         if (!businessAddress) {
    //             errors['business_address'] = "Business street is required";
    //         }
    //     } else {
    //         errors['user_type'] = "Select who are you?";
    //     }


    //     if (Object.keys(errors).length == 0) {
    //         let postData = {
    //             user_type: affiliatedWithNapaStore ? 'affiliated_with_napa_store' : 'installer_customer',
    //             name: fullName,
    //             email: emailAddress,
    //             city: city,
    //             state: stateName,
    //             zip: zip,
    //         };
    //         if (affiliatedWithNapaStore) {
    //             postData['store_number'] = storeNumber;
    //             postData['servicing_dc'] = servicingDC;
    //             postData['store_name'] = storeName;
    //             postData['store_address'] = storeAddress;
    //         } else if (anInstallerCustomer) {
    //             postData['business_name'] = businessName;
    //             postData['business_address'] = businessAddress;
    //         }

    //         let products = [];
    //         if (napaNewElectrical) {
    //             products.push(napaProducts.napaNewElectrical);
    //         }
    //         if (wilson) {
    //             products.push(napaProducts.wilson);
    //         }
    //         if (premiumPlus) {
    //             products.push(napaProducts.premiumPlus);
    //         }
    //         if (premiumSteering) {
    //             products.push(napaProducts.premiumSteering);
    //         }
    //         if (powerSupport) {
    //             products.push(napaProducts.powerSupport);
    //         }
    //         if (newSteering) {
    //             products.push(napaProducts.newSteering);
    //         }

    //         postData['products_buying'] = products.join("|");

    //         const {dispatch} = this.props;
    //         dispatch(actions.submitUserData(postData)).then(() => {
    //             setTimeout(() => {
    //                 const {dataAddingStatus} = this.props;
    //                 if (dataAddingStatus === 1) {
    //                     this.setState({
    //                         isShowForm: false,
    //                         screenType: 'spin',

    //                         affiliatedWithNapaStore: false,
    //                         anInstallerCustomer: false,

    //                         fullName: "",
    //                         emailAddress: "",

    //                         storeNumber: "",
    //                         servicingDC: "",
    //                         storeName: "",
    //                         storeAddress: "",

    //                         city: "",
    //                         stateName: "",
    //                         zip: "",

    //                         businessName: "",
    //                         businessAddress: "",

    //                         napaNewElectrical: false,
    //                         wilson: false,
    //                         premiumPlus: false,
    //                         premiumSteering: false,
    //                         powerSupport: false,
    //                         newSteering: false,
    //                         formErrors: null,
    //                     });
    //                 }
    //             }, 500);
    //         });
    //     } else {
    //         this.setState({formErrors: errors});
    //     }
    // }

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
                            onLoad={() => {
                                this.setState({isImageLoad: true}, () => {
                                    this.setUpSlots();
                                });
                            }}
                            className={'spin-bg-image'}
                            style={{opacity: (this.state.screenType == 'spin') ? 1 : 0}}
                            src={'images/spinbackground.png'}/>

                        <img
                            className={'spin-bg-image'}
                            src={'images/spinagainbackground.png'}
                            style={{opacity: (this.state.screenType == 'spinagain' || this.state.screenType == 'spinagainlast') ? 1 : 0}}
                        />

                        <img
                            className={'spin-bg-image'}
                            src={'images/finalscreen.png'}
                            style={{opacity: (this.state.screenType == 'finalscreen') ? 1 : 0}}
                        />

                        {/*{*/}
                        {/*    (this.state.screenType == 'finalscreen') && (*/}
                        {/*        <Button className={'start-over-btn'} pill onClick={() => {*/}
                        {/*            this.setState({disableSpin: false, isShowForm: true, screenType: 'spin'}, () => {*/}
                        {/*                this.setUpSlots();*/}
                        {/*            });*/}
                        {/*        }}>Start Over</Button>*/}
                        {/*    )*/}
                        {/*}*/}


                        {
                            (this.state.isImageLoad && (this.state.screenType === 'spinagain' || this.state.screenType === 'spinagainlast' || this.state.screenType === 'spin')) && (
                                <div id="rotate">
                                    <div id="ring1" className="ring"></div>
                                    <div id="ring2" className="ring"></div>
                                    <div id="ring3" className="ring"></div>
                                </div>
                            )
                        }


                        {
                            !this.state.disableSpin && (
                                <div className={'spin-btn'} onClick={this.spin}></div>
                            )
                        }

                    </div>

                    {
                        this.state.showVideo && (
                            <div className={'video-container'}>
                                <video controls={false} className={'video-view'} autoPlay muted id={'trainingvideoview'}
                                       onEnded={() => {
                                           this.setState({showVideo: false});
                                       }}>
                                    <source src="videos/NAPA.mp4" type="video/mp4"/>
                                </video>
                            </div>
                        )
                    }


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
                                                    ARE YOU?
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
                                                >affiliated with a NAPA store</FormCheckbox>
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
                                                    an installer customer
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
                                                <span className={'input-label'}>Email address</span>
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
                                                            <span className={'input-label'}>Store street</span>
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
                                                            <span className={'input-label'}>Business Street</span>
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


                                        <Row>
                                            <Col sm={12} md={3}>
                                                <span className={'input-label'}>City</span>
                                            </Col>
                                            <Col sm={12} md={9}>
                                                <FormInput
                                                    className="input-field"
                                                    value={this.state.city}
                                                    onChange={(e) => this.setState({city: e.target.value})}
                                                />
                                            </Col>
                                        </Row>
                                        {
                                            (this.state.formErrors && this.state.formErrors['city']) && (
                                                <Row>
                                                    <Col sm={12} md={3}></Col>
                                                    <Col sm={12} md={9}>
                                                        <div className={'input-error'}>
                                                            {this.state.formErrors['city']}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            )
                                        }

                                        <Row>
                                            <Col sm={12} md={3}>
                                                <span className={'input-label'}>State</span>
                                            </Col>
                                            <Col sm={12} md={9}>
                                                <FormInput
                                                    className="input-field"
                                                    value={this.state.stateName}
                                                    onChange={(e) => this.setState({stateName: e.target.value})}
                                                />
                                            </Col>
                                        </Row>
                                        {
                                            (this.state.formErrors && this.state.formErrors['state']) && (
                                                <Row>
                                                    <Col sm={12} md={3}></Col>
                                                    <Col sm={12} md={9}>
                                                        <div className={'input-error'}>
                                                            {this.state.formErrors['state']}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            )
                                        }


                                        <Row>
                                            <Col sm={12} md={3}>
                                                <span className={'input-label'}>Zip</span>
                                            </Col>
                                            <Col sm={12} md={9}>
                                                <FormInput
                                                    className="input-field"
                                                    value={this.state.zip}
                                                    onChange={(e) => this.setState({zip: e.target.value})}
                                                />
                                            </Col>
                                        </Row>
                                        {
                                            (this.state.formErrors && this.state.formErrors['zip']) && (
                                                <Row>
                                                    <Col sm={12} md={3}></Col>
                                                    <Col sm={12} md={9}>
                                                        <div className={'input-error'}>
                                                            {this.state.formErrors['zip']}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            )
                                        }


                                    </Container>


                                    <Container className={'product-choose-form'}>
                                        <Row>
                                            <Col>
                                                <div className={'heading4'}>
                                                    WHAT PRODUCTS ARE YOU CURRENTLY BUYING FROM NAPA?
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.napaNewElectrical}
                                                    onChange={e => {
                                                        this.handleProductChange(e, 'napaNewElectrical');
                                                    }}
                                                >
                                                    {napaProducts.napaNewElectrical}
                                                </FormCheckbox>
                                            </Col>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.wilson}
                                                    onChange={e => {
                                                        this.handleProductChange(e, 'wilson');
                                                    }}
                                                >
                                                    {napaProducts.wilson}
                                                </FormCheckbox>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.premiumPlus}
                                                    onChange={e => {
                                                        this.handleProductChange(e, 'premiumPlus');
                                                    }}
                                                >
                                                    {napaProducts.premiumPlus}
                                                </FormCheckbox>
                                            </Col>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.premiumSteering}
                                                    onChange={e => {
                                                        this.handleProductChange(e, 'premiumSteering');
                                                    }}
                                                >
                                                    {napaProducts.premiumSteering}
                                                </FormCheckbox>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.powerSupport}
                                                    onChange={e => {
                                                        this.handleProductChange(e, 'powerSupport');
                                                    }}
                                                >
                                                    {napaProducts.powerSupport}
                                                </FormCheckbox>
                                            </Col>
                                            <Col sm={12} md={6}>
                                                <FormCheckbox
                                                    checked={this.state.newSteering}
                                                    onChange={e => {
                                                        this.handleProductChange(e, 'newSteering');
                                                    }}
                                                >
                                                    {napaProducts.newSteering}
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
                                                }}>Let's Play! >></Button>
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
    const {dataAddingStatus, error} = state.user;
    return {
        dataAddingStatus,
        dataAddingError: error
    };
}

export default connect(mapStateToProps)(Spin);
