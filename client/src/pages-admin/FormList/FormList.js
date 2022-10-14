import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import "../Dashboard/Dashboard.scss";
import {Link} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import {faEdit, faTrash, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CSVLink} from "react-csv";
import * as moment from 'moment';
import NavbarPartial from '../Partials/NavbarPartial';
import CsvImport from '../Partials/CsvImport';

import {
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    FormInput,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Container,
    Row,
    Col,
    Alert,
    FormCheckbox
} from "shards-react";
import {formProducts} from "../../constants";

let checkboxwait = false;

class FormList extends Component {
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

        showConfirmDeleteModal: false,
        showUserDataModel: false,

        selectedUserData: null
    };


    componentWillMount() {
    }

    componentDidMount() {
        const userStr = localStorage.getItem('user_data');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.id && user.email) {
                    this.getUsersDataList();
                } else {
                    this.props.history.push("/admin/login");
                }
            } catch (e) {
                this.props.history.push("/admin/login");
            }
        } else {
            this.props.history.push("/admin/login");
        }
    }

    getUsersDataList = () => {
        const {dispatch} = this.props;
        dispatch(actions.formDataList({})).then(() => {

        });
    }

    deleteUserData = (userDataId) => {
        const {dispatch} = this.props;
        dispatch(actions.deleteFormData({
            id: userDataId
        })).then(() => {
            setTimeout(() => {
                const {dataDeleteStatus} = this.props;
                if (dataDeleteStatus === 1) {
                    this.setState({showConfirmDeleteModal: false});
                }
            }, 500);
        });
    }

    updateUserData = () => {

        const {selectedUserData} = this.state;
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
                id: selectedUserData._id,
                user_type: affiliatedWithNapaStore ? 'affiliated_with_napa_store' : 'installer_customer',
                name: fullName,
                email: emailAddress
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
            dispatch(actions.updateFormData(postData)).then(() => {
                setTimeout(() => {
                    const {dataUpdateStatus} = this.props;
                    if (dataUpdateStatus === 1) {
                        this.closeUserModal();
                    }
                }, 500);
            });
        } else {
            this.setState({formErrors: errors});
        }
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    closeUserModal = () => {
        this.setState({
            showUserDataModel: false,
            selectedUserData: null,

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


    showEditUserDataModal = (data) => {


        let states = {
            showUserDataModel: true,
            selectedUserData: data,

            affiliatedWithNapaStore: (data.user_type == 'affiliated_with_napa_store'),
            anInstallerCustomer: (data.user_type == 'installer_customer'),

            fullName: data.name,
            emailAddress: data.email,

            storeNumber: data.store_number,
            servicingDC: data.servicing_dc,
            storeName: data.store_name,
            storeAddress: data.store_address,

            businessName: data.business_name,
            businessAddress: data.business_address,

            oeTurboPowerTurboChargers: false,
            napaStartersAndAlternators: false,
            napaPowerSport: false,
            wilson: false,
            premiumNapaSteering: false,
            napaNewSteering: false,
            formErrors: null,
        };

        const products = data.products_buying.split("|");

        products.map((product) => {
            if (product === formProducts.oeTurboPowerTurboChargers) {
                states['oeTurboPowerTurboChargers'] = true;
            }
            if (product === formProducts.napaStartersAndAlternators) {
                states['napaStartersAndAlternators'] = true;
            }
            if (product === formProducts.napaPowerSport) {
                states['napaPowerSport'] = true;
            }
            if (product === formProducts.wilson) {
                states['wilson'] = true;
            }
            if (product === formProducts.premiumNapaSteering) {
                states['premiumNapaSteering'] = true;
            }
            if (product === formProducts.napaNewSteering) {
                states['napaNewSteering'] = true;
            }

        });

        this.setState(states);
    }


    formatCsvExport = (list) => {
        let formattedData = [
            [
                'No.',
                'User Type',
                'Full Name',
                'Email Address',
                'Product Buying',
                'Store Number',
                'Servicing DC',
                'Store Name',
                'Store Address',
                'Business Name',
                'Business Address',
                'Date'
            ]
        ];
        if (list) {
            list.map((data, key) => {
                formattedData.push([
                    key + 1,
                    (data.user_type == 'affiliated_with_napa_store') ? 'affiliated with a NAPA store' : 'an installer customer',
                    data.name,
                    data.email,
                    data.products_buying,
                    data.store_number,
                    data.servicing_dc,
                    data.store_name,
                    data.store_address,
                    data.business_name,
                    data.business_address,
                    moment(data.Created_date).format('DD-MM-YYYY')
                ]);
            });
        }
        console.log(JSON.stringify(formattedData));
        return formattedData;
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
        const {dataListStatus, formDataList, dataListError, dataDeleteStatus, dataDeleteError} = this.props;
        const {dataUpdateStatus, dataUpdateError} = this.props;
        let csvData = this.formatCsvExport(formDataList);

        return (
            <LoadingOverlay
                active={dataListStatus === -1 || dataDeleteStatus === -1 || dataUpdateStatus === -1}
                spinner
                text='Connecting...'
            >
                <div className="dashboard-page-container">
                    <NavbarPartial prop={this.props}/>

                    {
                        (formDataList && formDataList.length > 0) && (
                            <CsvImport csvData={csvData} filename={'form_list.csv'} />
                        )
                    }

                    <table className={"table-view"}>
                        <thead>
                        <tr>
                            <th>No.</th>
                            <th>User Type</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Products Buying</th>
                            <th>Date</th>
                            <th>Options</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            formDataList && formDataList.map((data, key) => {
                                return (
                                    <tr>
                                        <td>{key + 1}</td>
                                        <td>{data.user_type == 'affiliated_with_napa_store' ? 'affiliated with a NAPA store' : 'an installer customer'}</td>
                                        <td>{data.name}</td>
                                        <td>{data.email}</td>
                                        <td>{data.products_buying}</td>
                                        <td>{moment(data.Created_date).format('DD-MM-YYYY')}</td>
                                        <td className={'options'}>
                                            <Button className={'option-btn'} onClick={() => {
                                                this.showEditUserDataModal(data);
                                            }}><FontAwesomeIcon icon={faEdit}/></Button>
                                            <Button className={'option-btn delete'} onClick={() => {
                                                this.setState({
                                                    showConfirmDeleteModal: true,
                                                    selectedUserData: data,
                                                });
                                            }}><FontAwesomeIcon
                                                icon={faTrash}/></Button>

                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>


                <Modal centered={true} className={'userdata-edit-modal'} open={this.state.showUserDataModel}
                       toggle={() => {
                           this.setState({showUserDataModel: !this.state.showUserDataModel});
                       }}>
                    <ModalHeader>Edit Form Data</ModalHeader>
                    <ModalBody>
                        <div className={'form-container'}>
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
                            </Container>

                            <Container className={'input-form'}>
                                <Row>
                                    <Col sm={12} md={4}>
                                        <span className={'input-label'}>Full Name</span>
                                    </Col>
                                    <Col sm={12} md={8}>
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
                                            <Col sm={12} md={4}></Col>
                                            <Col sm={12} md={8}>
                                                <div className={'input-error'}>
                                                    {this.state.formErrors['name']}
                                                </div>
                                            </Col>
                                        </Row>
                                    )
                                }


                                <Row>
                                    <Col sm={12} md={4}>
                                        <span className={'input-label'}>Email address</span>
                                    </Col>
                                    <Col sm={12} md={8}>
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
                                            <Col sm={12} md={4}></Col>
                                            <Col sm={12} md={8}>
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
                                                <Col sm={12} md={4}>
                                                    <span className={'input-label'}>Store number</span>
                                                </Col>
                                                <Col sm={12} md={8}>
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
                                                        <Col sm={12} md={4}></Col>
                                                        <Col sm={12} md={8}>
                                                            <div className={'input-error'}>
                                                                {this.state.formErrors['store_number']}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                )
                                            }


                                            <Row>
                                                <Col sm={12} md={4}>
                                                    <span className={'input-label'}>Servicing DC</span>
                                                </Col>
                                                <Col sm={12} md={8}>
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
                                                        <Col sm={12} md={4}></Col>
                                                        <Col sm={12} md={8}>
                                                            <div className={'input-error'}>
                                                                {this.state.formErrors['servicing_dc']}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                )
                                            }

                                            <Row>
                                                <Col sm={12} md={4}>
                                                    <span className={'input-label'}>Store Name</span>
                                                </Col>
                                                <Col sm={12} md={8}>
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
                                                        <Col sm={12} md={4}></Col>
                                                        <Col sm={12} md={8}>
                                                            <div className={'input-error'}>
                                                                {this.state.formErrors['store_name']}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                )
                                            }

                                            <Row>
                                                <Col sm={12} md={4}>
                                                    <span className={'input-label'}>Store Address</span>
                                                </Col>
                                                <Col sm={12} md={8}>
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
                                                        <Col sm={12} md={4}></Col>
                                                        <Col sm={12} md={8}>
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
                                                <Col sm={12} md={4}>
                                                    <span className={'input-label'}>Business Name</span>
                                                </Col>
                                                <Col sm={12} md={8}>
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
                                                        <Col sm={12} md={4}></Col>
                                                        <Col sm={12} md={8}>
                                                            <div className={'input-error'}>
                                                                {this.state.formErrors['business_name']}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                )
                                            }

                                            <Row>
                                                <Col sm={12} md={4}>
                                                    <span className={'input-label'}>Business Address</span>
                                                </Col>
                                                <Col sm={12} md={8}>
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
                                                        <Col sm={12} md={4}></Col>
                                                        <Col sm={12} md={8}>
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
                                            WHAT PRODUCTS ARE YOU CURRENTLY BUYING FROM NAPA?
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
                                dataUpdateStatus == 0 && (
                                    <Alert theme="danger">{dataUpdateError}</Alert>
                                )
                            }

                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button className={'play-btn'} onClick={() => {
                            this.updateUserData();
                        }} theme={'success'}>Save</Button>
                        <Button theme={'dark'} className={'play-btn'} onClick={() => {
                            this.closeUserModal();
                        }}>Cancel</Button>
                    </ModalFooter>
                </Modal>


                <Modal open={this.state.showConfirmDeleteModal} toggle={() => {
                    this.setState({showConfirmDeleteModal: false})
                }}>
                    <ModalHeader>Confirm!</ModalHeader>
                    <ModalBody>
                        Do you really want to remove this form data?
                        {
                            dataDeleteStatus == 0 && (
                                <Alert theme="danger">{dataDeleteError}</Alert>
                            )
                        }

                    </ModalBody>
                    <ModalFooter>
                        <Button theme={'danger'} onClick={() => {
                            this.deleteUserData(this.state.selectedUserData._id);
                        }}>YES</Button>
                        <Button theme={'dark'} onClick={() => {
                            this.setState({showConfirmDeleteModal: false});
                        }}>NO</Button>
                    </ModalFooter>
                </Modal>
            </LoadingOverlay>

        );
    }
}

const mapStateToProps = (state) => {
    const {dataListStatus, dataDeleteStatus, formDataList, dataListError, dataDeleteError, dataUpdateStatus, dataUpdateError} = state.form;
    return {
        dataListStatus,
        dataDeleteStatus,
        formDataList,
        dataListError,
        dataDeleteError,
        dataUpdateStatus,
        dataUpdateError
    };
}

export default connect(mapStateToProps)(FormList);
