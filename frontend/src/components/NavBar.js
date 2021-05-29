import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Navbar, Nav, Button } from 'react-bootstrap';
import { AiOutlineHome, AiOutlineLock, AiOutlineInfoCircle } from 'react-icons/ai';
import { BsCloudUpload } from 'react-icons/bs';
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
          <>
            <Nav.Link href="/upload">
              <BsCloudUpload className="mr-1 mb-1" />
              Upload
            </Nav.Link>
            <Nav.Link href="/list">
              <FaRegFileAudio className="mr-1 mb-1" />
              Files
            </Nav.Link>
          </>
        )}
        <Nav.Link disabled href="/about">
          <AiOutlineInfoCircle className="mr-1 mb-1" />
          About
        </Nav.Link>
        {auth.isAuthenticated ? (
          <>
            <Button
              variant="outline-secondary mt-3 mb-1 ml-2"
              size="sm"
              onClick={() => dispatch(logout())}
            >
              <AiOutlineLock className="mr-1 mb-1" />
              Logout
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button variant="outline-primary mt-3 mb-1 ml-2" size="sm">
              <AiOutlineLock className="mr-1 mb-1" />
              Login
            </Button>
          </Link>
        )}
      </Nav>
    </Navbar>
  );
}
