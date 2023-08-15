import { useEffect, useState } from "react";
import DepartmentDataService from "../services/department.service";
import { validProjName } from "../common/regex";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DepartmentModal({ department, show, onSubmit, onHide }) {
    const [editMode, setEditMode] = useState(false);

    const [id, setId] = useState(null);
    const [deptName, setDeptName] = useState('');
    const [location, setLocation] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [validation, setValidation] = useState({
        isDeptNameValid: true,
        isLocationValid: true
    })

    useEffect(() => {
        if (department) {
            setEditMode(true);
            setDepartment();
        }
    }, []);

    function setDepartment() {
        setId(department.id);
        setDeptName(department.deptName);
        setLocation(department.location);
    }

    function saveDepartment() {
        var data = {
            deptName: deptName,
            location: location
        };
        console.log(data);

        DepartmentDataService.create(data)
            .then(response => {
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    function updateDepartment() {
        var data = {
            id: id,
            deptName: deptName,
            location: location
        };
        console.log(data);

        DepartmentDataService.update(id, data)
            .then(response => {
                console.log(response.data);
                setSubmitted(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    function newDepartment() {
        setDeptName('');
        setLocation('');
        setSubmitted(false);
    }

    function checkValidation() {
        setValidation({
            isDeptNameValid: validProjName.test(deptName),
            isLocationValid: validProjName.test(location)
        });
        return (
            validProjName.test(deptName)
            && validProjName.test(location)
        );
    }

    return (
        <div>
            <Modal
                size="lg"
                centered
                onHide={() => {
                    onHide();
                    if (!editMode) {
                        setTimeout(() => {
                            newDepartment();
                        }, 500)
                    }
                }}
                show={show}
                onShow={() => {
                    if (editMode) {
                        setDepartment();
                        setValidation({
                            isDeptNameValid: true,
                            isLocationValid: true
                        });
                    }
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {(editMode) ? 'Update' : 'Add'} Department
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="submit-form">
                        {submitted ? (
                            <div className="row">
                                <h4>Department {(editMode) ? 'updated' : 'added'} successfully!</h4>
                            </div>
                        ) : (
                            <div className="container">
                                <div className="form-group">
                                    <label htmlFor="name">Department Name</label>
                                    <input
                                        type="text"
                                        className={"form-control" + ((validation.isDeptNameValid) ? '' : ' is-invalid')}
                                        id="name"
                                        required
                                        value={deptName}
                                        onChange={(e) => {
                                            setDeptName(e.target.value);
                                            setValidation((v) => ({
                                                ...v,
                                                isDeptNameValid: (validProjName.test(e.target.value))
                                            }))
                                        }}
                                        name="name"
                                    />
                                    {(!validation.isDeptNameValid) ? (
                                        <span className="form-error-text">Invalid department name (can only have letters, numbers, ., (, ), spaces, and must not be empty)</span>
                                    ) : (<></>)}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        type="text"
                                        className={"form-control" + ((validation.isLocationValid) ? '' : ' is-invalid')}
                                        id="location"
                                        required
                                        value={location}
                                        onChange={(e) => {
                                            setLocation(e.target.value);
                                            setValidation((v) => ({
                                                ...v,
                                                isLocationValid: (validProjName.test(e.target.value))
                                            }))
                                        }}
                                        name="location"
                                    />
                                    {(!validation.isLocationValid) ? (
                                        <span className="form-error-text">Invalid location name (can only have letters, numbers, ., (, ), spaces, and must not be empty)</span>
                                    ) : (<></>)}
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                {(submitted) ? (
                    <></>
                ) : (
                    <Modal.Footer>
                        <Button
                            variant="success"
                            onClick={() => {
                                if (checkValidation()) {
                                    if (editMode) {
                                        updateDepartment();
                                    } else {
                                        saveDepartment();
                                    }
                                    setTimeout(() => {
                                        onSubmit();
                                        onHide();
                                    }, 2000);
                                    setTimeout(() => {
                                        newDepartment();
                                    }, 2500);
                                }
                            }}
                        >
                            Submit
                        </Button>
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    );
}

export default DepartmentModal;