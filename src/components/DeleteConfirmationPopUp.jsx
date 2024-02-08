import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import '../styles/DeleteConfirmation.css'; 

const DeleteConfirmation = ({ onDelete }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDelete = () => {
    onDelete();
    handleClose();
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow} className="delete-account-button">
        Delete Account
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton={false}>
          <Modal.Title className="modal-title">Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">Are you sure you want to delete your account?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete} className="delete-button">
            Delete
          </Button>
          <Button variant="secondary" onClick={handleClose} className="cancel-button">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteConfirmation;
