import React from 'react';
import { Link } from 'react-router-dom';

import { Navbar, Nav, Button } from 'react-bootstrap';
import { AiOutlineHome, AiOutlineLock } from 'react-icons/ai';
import { BsCloudUpload, BsList } from 'react-icons/bs';

import logo from '../assets/img/logo.png';

export default function NavBar() {
  return (
    <Navbar bg="dark">
      <Navbar.Brand>
        <img src={logo} height="45" />
      </Navbar.Brand>

      <Nav className="ml-auto text-primary">
        <Nav.Link href="/">
          <AiOutlineHome className="mr-1 mb-1" />
          Home
        </Nav.Link>
        <Nav.Link href="/upload">
          <BsCloudUpload className="mr-1 mb-1" />
          Upload
        </Nav.Link>
        <Nav.Link href="/list">
          <BsList className="mr-1 mb-1" />
          List
        </Nav.Link>
        <Link to="/login">
          <Button variant="outline-primary mt-3 mb-1 ml-2" size="sm">
            <AiOutlineLock className="mr-1 mb-1" />
            Login
          </Button>
        </Link>
      </Nav>
    </Navbar>
  );
}
