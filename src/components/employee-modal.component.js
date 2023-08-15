import { useEffect, useState } from "react";
import EmployeeDataService from "../services/employee.service";
import SelectDepartment from "./select-department.component";
import SelectProjects from "./select-projects.component";
import { validName, validEmail } from "../common/regex";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import AddDepartmentModal from "./department-modal.component";
import DepartmentDataService from "../services/department.service";

function EmployeeModal({ employee, show, onSubmit, onHide }) {
    const [editMode, setEditMode] = useState(false);

    const [id, setId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [hireDate, setHireDate] = useState(new Date().toISOString());
    const [departmentId, setDepartmentId] = useState(-1);
    const [projectIds, setProjectIds] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const [showNoDept, setShowNoDept] = useState(false);
    const [addDepartmentModalVisble, setAddDepartmentModalVisible] = useState(false);

    const [validation, setValidation] = useState({
        isFirstNameValid: true,
        isLastNameValid: true,
        isEmailValid: true,
        isDepartmentValid: true
    });

    useEffect(() => {
        checkDepartments();
        if (employee) {
            setEditMode(true);
            setEmployee();
        }
    }, []);

    function setEmployee() {
        setId(employee.id);
        setFirstName(employee.firstName);
        setLastName(employee.lastName);
        setEmail(employee.email);
        setHireDate(employee.hireDate);
        setDepartmentId(employee.department.id);
        let projIds = [];
        if (employee.projects)
            employee.projects.map((proj) => {
                projIds.push(proj.id)
            });
        setProjectIds(projIds);
    }

    function saveEmployee() {
        var data = {
            employee: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                hireDate: hireDate
            },
            departmentId: departmentId,
            projectIds: projectIds
        };
        console.log(data);

        EmployeeDataService.create(data)
            .then(response => {
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    function updateEmployee() {
        var data = {
            employee: {
                id: id,
                firstName: firstName,
                lastName: lastName,
                email: email,
                hireDate: hireDate
            },
            departmentId: departmentId,
            projectIds: projectIds
        }
        console.log(data);

        EmployeeDataService.update(id, data)
            .then(response => {
                console.log(response.data);
                setSubmitted(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    function newEmployee() {
        setFirstName('');
        setLastName('');
        setEmail('');
        setHireDate(new Date().toISOString());
        setDepartmentId(-1);
        setProjectIds([]);
        setSubmitted(false);
        setValidation({
            isFirstNameValid: true,
            isLastNameValid: true,
            isEmailValid: true,
            isDepartmentValid: true
        });
    }

    function checkDepartments() {
        DepartmentDataService.getAll()
            .then((response) => {
                if (response === null || response.data.length === 0) {
                    setShowNoDept(true);
                }
            });
    }

    function checkValidation() {
        setValidation({
            isFirstNameValid: validName.test(firstName),
            isLastNameValid: validName.test(lastName),
            isEmailValid: validEmail.test(email),
            isDepartmentValid: (departmentId !== -1)
        });
        return (
            validName.test(firstName)
            && validName.test(lastName)
            && validEmail.test(email)
            && (departmentId !== -1)
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
                            newEmployee();
                        }, 500)
                    }
                }}
                show={show}
                onShow={() => {
                    checkDepartments();
                    if (editMode) {
                        setEmployee();
                        setValidation({
                            isFirstNameValid: true,
                            isLastNameValid: true,
                            isEmailValid: true,
                            isDepartmentValid: true
                        });
                    }
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {(editMode) ? 'Update' : 'Add'} Employee
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="submit-form">
                        {submitted ? (
                            <div className="row">
                                <h4>Employee {(editMode) ? 'updated' : 'added'} successfully!</h4>
                            </div>
                        ) : (
                            <div className="container">
                                <div className="form-group">
                                    <label htmlFor="fname">First Name</label>
                                    <input
                                        type="text"
                                        className={"form-control" + ((validation.isFirstNameValid) ? '' : ' is-invalid')}
                                        id="fname"
                                        required
                                        value={firstName}
                                        onChange={(e) => {
                                            setFirstName(e.target.value);
                                            setValidation((v) => ({
                                                ...v,
                                                isFirstNameValid: (validName.test(e.target.value))
                                            }));
                                        }}
                                        name="fname"
                                    />
                                    {(!validation.isFirstNameValid) ? (
                                        <span className="form-error-text">Invalid first name (can only have letters, ., spaces, and must not be empty)</span>
                                    ) : (<></>)}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lname">Last Name</label>
                                    <input
                                        type="text"
                                        className={"form-control" + ((validation.isLastNameValid) ? '' : ' is-invalid')}
                                        id="lname"
                                        required
                                        value={lastName}
                                        onChange={(e) => {
                                            setLastName(e.target.value);
                                            setValidation((v) => ({
                                                ...v,
                                                isLastNameValid: (validName.test(e.target.value))
                                            }));
                                        }}
                                        name="lname"
                                    />
                                    {(!validation.isLastNameValid) ? (
                                        <span className="form-error-text">Invalid last name (can only have letters, ., spaces, and must not be empty)</span>
                                    ) : (<></>)}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="text"
                                        className={"form-control" + ((validation.isEmailValid) ? '' : ' is-invalid')}
                                        id="email"
                                        required
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setValidation((v) => ({
                                                ...v,
                                                isEmailValid: (validEmail.test(e.target.value))
                                            }));
                                        }}
                                        name="email"
                                    />
                                    {(!validation.isEmailValid) ? (
                                        <span className="form-error-text">Invalid email (must be a valid email and not empty)</span>
                                    ) : (<></>)}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="hireDate">Hire Date</label>
                                    <div className="w-100"></div>
                                    <DatePicker
                                        selected={new Date(hireDate)}
                                        dateFormat={'yyyy/MM/dd'}
                                        className="form-control"
                                        id="hiredate"
                                        required
                                        maxDate={new Date()}
                                        onChange={(date) => setHireDate((date) ? date.toISOString() : null)}
                                        name="hiredate"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="department">Department</label>
                                    <span>
                                        <SelectDepartment
                                            isValid={validation.isDepartmentValid}
                                            defaultDeptId={(departmentId !== -1) ? departmentId : null}
                                            onChange={(o) => {
                                                setDepartmentId(o.value);
                                                setValidation((v) => ({
                                                    ...v,
                                                    isDepartmentValid: (o.value !== -1)
                                                }));
                                            }}
                                        />
                                    </span>
                                    {(!validation.isDepartmentValid) ? (
                                        <span className="form-error-text">Please select a department</span>
                                    ) : (<></>)}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="projects">Projects</label>
                                    <span>
                                        <SelectProjects
                                            defaultProjIds={projectIds}
                                            onChange={(o) => {
                                                let ids = []
                                                o.map((projItem) => {
                                                    ids.push(projItem.value);
                                                });
                                                setProjectIds(ids);
                                            }}
                                        />
                                    </span>
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
                                        updateEmployee();
                                    } else {
                                        saveEmployee();
                                    }
                                    setTimeout(() => {
                                        onSubmit();
                                        onHide();
                                    }, 2000);
                                    setTimeout(() => {
                                        newEmployee();
                                    }, 2500);
                                }
                            }}
                        >
                            Submit
                        </Button>
                    </Modal.Footer>
                )}
            </Modal>

            <Modal
                size="sm"
                centered
                show={showNoDept}
            >
                <Modal.Header>
                    <Modal.Title>
                        No Departments Exist!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Please add a department to continue.
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="success"
                        onClick={() => {
                            setAddDepartmentModalVisible(true);
                            setShowNoDept(false);
                            onHide();
                        }}
                    >
                        Add Department
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            setShowNoDept(false);
                            onHide();
                        }}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <AddDepartmentModal
                show={addDepartmentModalVisble}
                onHide={() => {
                    setAddDepartmentModalVisible(false);
                }}
                onSubmit={() => {}}
            />
        </div>
    );
}

export default EmployeeModal;