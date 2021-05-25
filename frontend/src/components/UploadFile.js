import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Row, ButtonGroup, Button } from 'react-bootstrap';
import { BsUpload } from 'react-icons/bs';
import { CgBrowse } from 'react-icons/cg';
import { AiOutlineClose } from 'react-icons/ai';

export default function UploadFile({ handelUpload, setfile, File }) {
  const [isFileSelected, setFileSelected] = useState(false);

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleFileBrowse = () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', 'audio/*,video/*');
    fileSelector.click();
    fileSelector.addEventListener('change', function (event) {
      var file = event.target.files[0];
      setfile(file);
      setFileSelected(true);
    });
  };

  return (
    <>
      <Row className="justify-content-center text-primary mb-4 h5">
        <ButtonGroup>
          <Button variant="outline-secondary" className="bg-dark text-secondary px-5">
            {!isFileSelected ? (
              <>Browse & Select File to Upload</>
            ) : (
              <>
                {File.name}
                <br />
                {formatBytes(File.size)}
              </>
            )}
          </Button>
          {isFileSelected && (
            <Button
              variant="outline-secondary"
              onClick={() => {
                setfile(null);
                setFileSelected(false);
              }}
            >
              <AiOutlineClose />
            </Button>
          )}
        </ButtonGroup>
      </Row>

      <Row className="justify-content-center">
        <ButtonGroup horizontal="true">
          <Button
            size="lg"
            disabled={isFileSelected}
            variant="outline-primary"
            onClick={() => handleFileBrowse()}
          >
            <CgBrowse /> <br />
            Browse
          </Button>
          <Button
            size="lg"
            disabled={!isFileSelected}
            variant="outline-secondary"
            onClick={() => handelUpload()}
          >
            <BsUpload /> <br /> Upload
          </Button>
        </ButtonGroup>
      </Row>
    </>
  );
}

UploadFile.propTypes = {
  handelUpload: PropTypes.func,
  setfile: PropTypes.func,
  File: PropTypes.object,
};
