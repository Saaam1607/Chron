import React, { useState } from 'react';
import { Card, Button, Modal, Table, Form } from 'react-bootstrap';
import TaskAssignment from './TaskAssignment';

export default function GroupDetailsModal({ groupName, leader, members, isLeader, onClose }) {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showTaskAssignmentModal, setShowTaskAssignmentModal] = useState(false);

    const handleMemberSelection = (member) => {
        const isSelected = selectedMembers.some((selectedMember) => selectedMember.id === member.id);
        if (isSelected) {
          setSelectedMembers(selectedMembers.filter((selectedMember) => selectedMember.id !== member.id));
        } else {
          setSelectedMembers([...selectedMembers, member]);
        }
    };

    const handleAssignTask = () => {
        setShowTaskAssignmentModal(true);
    };

    const handleTaskAssignmentClose = () => {
        setShowTaskAssignmentModal(false);
    };

    return (
        <Modal show={true} onHide={onClose} dialogClassName="custom-modal-dialog" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{groupName}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Card.Subtitle className="mb-2 text-muted">Leader: {leader}</Card.Subtitle>

                <Table bordered hover>
                <thead>
                    <tr>
                    <th>Membro</th>
                    <th>Email</th>
                    <th>Seleziona</th>
                    <th></th>
                    </tr>
                </thead>

                <tbody>
                    {members[0].length > 0 ? (
                    members[0].map((membro) => (
                        <tr key={membro[0]}>
                        <td>{membro[1]}</td>
                        <td>{membro[2]}</td>
                        <td className="text-center">
                            {isLeader && (
                                <Form.Check
                                    type="checkbox"
                                    checked={selectedMembers.some((selectedMember) => selectedMember.id === membro[0])}
                                    onChange={() => handleMemberSelection({ id: membro[0], name: membro[1], email: membro[2] })}
                                />
                            )}
                        </td>
                        <td className="text-center">
                            {isLeader && (
                            <Button variant="danger" onClick={() => console.log('RIMUOVI')}>
                                Rimuovi
                            </Button>
                            )}
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="5" className="text-center">
                        Non ci sono membri da mostrare.
                        </td>
                    </tr>
                    )}
                </tbody>
                </Table>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                Close
                </Button>
                {isLeader && selectedMembers.length > 0 && (
                <Button variant="primary" className="add-button" onClick={handleAssignTask}>
                    Assegna Task
                </Button>
                )}
            </Modal.Footer>

            <Modal show={showTaskAssignmentModal} onHide={handleTaskAssignmentClose} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Assegna Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <TaskAssignment selectedMembers={selectedMembers} groupName={groupName} onClose={handleTaskAssignmentClose} />
                </Modal.Body>
            </Modal>
        </Modal>
    );
}