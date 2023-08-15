import { useEffect, useState } from "react";
import ProjectDataService from "../services/project.service";
import SelectDepartment from "./select-department.component";
import SelectEmployees from "./select-employees.component";
import { validProjName } from "../common/regex";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import AddDepartmentModal from "./department-modal.component";
import DepartmentDataService from "../services/department.service";

function ProjectModal({ project, show, onSubmit, onHide }) {
    const [editMode, setEditMode] = useState(false);

    const [id, setId] = useState(null);
    const [projName, setProjName] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString());
    const [endDate, setEndDate] = useState(new Date().toISOString());
    const [departmentId, setDepartmentId] = useState(-1);
    const [employeeIds, setEmployeeIds] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const [showNoDept, setShowNoDept] = useState(false);
    const [addDepartmentModalVisble, setAddDepartmentModalVisible] = useState(false);

    const [validation, setValidation] = useState({
        isProjNameValid: true,
        isDepartmentValid: true
    });

    useEffect(() => {
        checkDepartments();
        if (project) {
            setEditMode(true);
            setProject();
        }
    }, []);

    function setProject() {
        setId(project.id);
        setProjName(project.projName);
        setStartDate(project.startDate);
        setEndDate(project.endDate);
        setDepartmentId(project.department.id);
        let empIds = [];
        if (project.employees)
            project.employees.map((emp) => {
                empIds.push(emp.id)
            });
        setEmployeeIds(empIds);
    }

    function saveProject() {
        var data = {
            project: {
                projName: projName,
                startDate: startDate,
                endDate: endDate
            },
            departmentId: departmentId,
            employeeIds: employeeIds
        };
        console.log(data);

        ProjectDataService.create(data)
            .then(response => {
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    function updateProject() {
        var data = {
            project: {
                projName: projName,
                startDate: startDate,
                endDate: endDate
            },
            departmentId: departmentId,
            employeeIds: employeeIds
        };
        console.log(data);

        ProjectDataService.update(id, data)
            .then(response => {
                console.log(response.data);
                setSubmitted(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    function newProject() {
        setProjName('');
        setStartDate(new Date().toISOString());
        setEndDate(new Date().toISOString());
        setDepartmentId(-1);
        setEmployeeIds([]);
        setSubmitted(false);
        setValidation({
            isProjNameValid: true,
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
            isProjNameValid: validProjName.test(projName),
            isDepartmentValid: (departmentId !== -1)
        });
        return (
            validProjName.test(projName)
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
                            newProject();
                        }, 500)
                    }
                }}
                show={show}
                onShow={() => {
                    checkDepartments();
                    if (editMode) {
                        setProject();
                        setValidation({
                            isProjNameValid: true,
                            isDepartmentValid: true
                        });
                    }
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {(editMode) ? 'Update' : 'Add'} Project
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="submit-form">
                        {submitted ? (
                            <div className="row">
                                <h4>Project {(editMode) ? 'updated' : 'added'} successfully!</h4>
                            </div>
                        ) : (
                            <div className="container">
                                <div className="form-group">
                                    <label htmlFor="fname">Project Name</label>
                                    <input
                                        type="text"
                                        className={"form-control" + ((validation.isProjNameValid) ? '' : ' is-invalid')}
                                        id="name"
                                        required
                                        value={projName}
                                        onChange={(e) => {
                                            setProjName(e.target.value);
                                            setValidation((v) => ({
                                                ...v,
                                                isProjNameValid: (validProjName.test(e.target.value))
                                            }))
                                        }}
                                        name="name"
                                    />
                                    {(!validation.isProjNameValid) ? (
                                        <span className="form-error-text">Invalid project name (can only have letters, numbers, ., (, ), spaces, and must not be empty)</span>
                                    ) : (<></>)}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="startDate">Start Date</label>
                                    <div className="w-100"></div>
                                    <DatePicker
                                        selected={new Date(startDate)}
                                        dateFormat={'yyyy/MM/dd'}
                                        className="form-control"
                                        id="startDate"
                                        maxDate={new Date(endDate)}
                                        required
                                        onChange={(date) => setStartDate((date) ? date.toISOString() : null)}
                                        name="startDate"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="endDate">Expected End Date</label>
                                    <div className="w-100"></div>
                                    <DatePicker
                                        selected={new Date(endDate)}
                                        dateFormat={'yyyy/MM/dd'}
                                        className="form-control"
                                        id="endDate"
                                        minDate={new Date(startDate)}
                                        required
                                        onChange={(date) => setEndDate((date) ? date.toISOString() : null)}
                                        name="endDate"
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
                                    <label htmlFor="department">Employees</label>
                                    <span>
                                        <SelectEmployees
                                            defaultEmpIds={employeeIds}
                                            onChange={(o) => {
                                                let ids = []
                                                o.map((empItem) => {
                                                    ids.push(empItem.value);
                                                });
                                                setEmployeeIds(ids);
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
                                        updateProject();
                                    } else {
                                        saveProject();
                                    }
                                    setTimeout(() => {
                                        onSubmit();
                                        onHide();
                                    }, 2000);
                                    setTimeout(() => {
                                        newProject();
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

export default ProjectModal;