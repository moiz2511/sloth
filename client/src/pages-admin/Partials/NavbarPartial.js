import React from "react";
import {Nav, NavbarBrand, NavItem, Navbar, NavLink} from "shards-react";

const NavbarPartial=(props)=>{
    return(
        <Navbar  type="dark" theme="dark" expand="md">
            <NavbarBrand href="#">NAPA Panel</NavbarBrand>

            <Nav navbar>
                <NavItem>
                    <NavLink href={'/admin/dashboard'}>
                        Dashboard
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href={'/admin/form-list'}>
                        Form
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="#" onClick={() => {
                        localStorage.removeItem('user_data');
                        props.prop.history.push("/admin/login");
                    }}>
                        Logout
                    </NavLink>
                </NavItem>
            </Nav>
        </Navbar>
    );
}

export default NavbarPartial;