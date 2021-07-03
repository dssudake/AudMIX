import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { AiOutlineHome, AiOutlineLock, AiOutlineInfoCircle } from 'react-icons/ai';
import { BsCloudUpload } from 'react-icons/bs';
import { BiUserCircle } from 'react-icons/bi';
import { FaRegFileAudio } from 'react-icons/fa';

import logo from '../assets/img/logo.png';
import { logout } from '../redux/actions';

export default function NavBar() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

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
        {auth.isAuthenticated && (
          <Nav.Link href="/upload">
            <BsCloudUpload className="mr-1 mb-1" />
            Upload
          </Nav.Link>
        )}
        <Nav.Link disabled href="/about">
          <AiOutlineInfoCircle className="mr-1 mb-1" />
          About
        </Nav.Link>
        {auth.isAuthenticated ? (
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" className="mt-3 mb-1 ml-2" size="sm">
              <BiUserCircle className="mr-1" style={{ marginBottom: '2px' }} />
              {auth.user.username}
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-2">
              <Dropdown.Item href="/list">
                <FaRegFileAudio className="mr-1 mb-1" />
                My Files
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => dispatch(logout())} href="#">
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Link to="/login">
            <Button variant="outline-primary" className="mt-3 mb-1 ml-2" size="sm">
              <AiOutlineLock className="mr-1 mb-1" />
              Login
            </Button>
          </Link>
        )}
      </Nav>
    </Navbar>
  );
}
