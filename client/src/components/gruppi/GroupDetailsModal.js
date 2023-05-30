import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

export default function GroupDetailsModal ({ groupName, description, leader, members, onClose }){
  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{groupName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card.Text>{description}</Card.Text>
        <Card.Subtitle className="mb-2 text-muted">Leader: {leader}</Card.Subtitle>
        {/* <Card.Text>Members: {members.join(', ')}</Card.Text> */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

