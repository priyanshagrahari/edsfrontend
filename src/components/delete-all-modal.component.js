import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function DeleteModal({ show = false, onDelete, onCancel,
    dataType, deleteAll = true }) {
    return (
        <Modal
            show={show}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete {(deleteAll) ? 'All' : dataType}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(deleteAll) ? (
                    <>
                        <strong>All the {(dataType)?' '+dataType:''} entries will be deleted forever!</strong> <br />
                    </>
                ) : (
                    <>
                        <strong>The selected {dataType} will be deleted forever!</strong> <br />
                    </>
                )}
                Are you sure you wish to proceed?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onDelete}>
                    Confirm
                </Button>
                <Button onClick={onCancel}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}