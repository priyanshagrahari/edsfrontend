import { useState, useEffect } from "react";
import EmployeeDataService from "../services/employee.service";

import Select from 'react-select';
import { Form, InputGroup, Accordion, ListGroup, Button, Container, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import SelectDepartment from "./select-department.component";
import SelectProjects from "./select-projects.component";
import DeleteModal from "./delete-all-modal.component";
import EmployeeModal from "./employee-modal.component";

export default function EmployeesList() {
    const [employees, setEmployees] = useState([]);
    const [empFilters, setEmpFilters] = useState({
        firstName: null,
        lastName: null,
        email: null,
        afterDate: null,
        beforeDate: null,
        departmentId: -1,
        projectIds: null
    });
    const [addEmployeeModalVisble, setAddEmployeeModalVisible] = useState(false);
    const [deleteAllModalVisible, setDeleteAllModalVisible] = useState(false);
    const [employeeModalIndex, setEmployeeModalIndex] = useState(-1);
    const [deleteModalIndex, setDeleteModalIndex] = useState(-1);

    const [filtersVisible, setFiltersVisible] = useState(false);
    const [filtersOverflowStyle, setFiltersOverflowStyle] = useState({ overflow: 'hidden' });
    const [filterText, setFilterText] = useState('');
    const [lastNameText, setLastNameText] = useState('');
    let filterTextOptions =
        [
            { value: 0, label: 'Full Name' },
            { value: 1, label: 'First Name' },
            { value: 2, label: 'Last Name' },
            { value: 3, label: 'Email' }
        ];
    const [currentFilterOption, setCurrentFilterOption] = useState(filterTextOptions[0]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.addEventListener('onRefresh', retrieveEmployees);
        return () => document.removeEventListener('onRefresh', retrieveEmployees)
    }, []);

    useEffect(() => {
        retrieveEmployees();
        setEmployeeModalIndex(-1);
        setDeleteModalIndex(-1);
    }, [empFilters]);

    useEffect(() => {
        if (currentFilterOption.value === 0) {
            setEmpFilters((f) => ({
                ...f,
                firstName: (filterText !== '') ? filterText : null,
                lastName: (lastNameText !== '') ? lastNameText : null,
                email: null
            }))
        } else if (currentFilterOption.value === 1) {
            setEmpFilters((f) => ({
                ...f,
                firstName: (filterText !== '') ? filterText : null,
                lastName: null,
                email: null
            }))
        } else if (currentFilterOption.value === 2) {
            setEmpFilters((f) => ({
                ...f,
                firstName: null,
                lastName: (filterText !== '') ? filterText : null,
                email: null
            }))
        } else if (currentFilterOption.value === 3) {
            setEmpFilters((f) => ({
                ...f,
                firstName: null,
                lastName: null,
                email: (filterText !== '') ? filterText : null
            }))
        }
    }, [filterText, lastNameText, currentFilterOption]);

    function retrieveEmployees() {
        setLoading(true);
        console.log(empFilters);
        EmployeeDataService.filter(empFilters)
            .then(response => {
                setEmployees(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
        setTimeout(() => {
            setLoading(false);
        }, 200);
    }

    function deleteEmployee(employee) {
        setDeleteModalIndex(-1);
        EmployeeDataService.delete(employee.id)
            .then(response => {
                console.log(response.data);
                retrieveEmployees();
            })
            .catch(e => {
                console.log(e);
            });
    }

    function deleteAllEmployees() {
        EmployeeDataService.deleteAll()
            .then(response => {
                console.log(response.data);
                retrieveEmployees();
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
        <div className="row">
            <EmployeeModal
                show={addEmployeeModalVisble}
                onSubmit={retrieveEmployees}
                onHide={() => setAddEmployeeModalVisible(false)}
            />

            <DeleteModal
                show={deleteAllModalVisible}
                onDelete={() => {
                    deleteAllEmployees();
                    setDeleteAllModalVisible(false);
                }}
                onCancel={() => setDeleteAllModalVisible(false)}
                dataType={'Employee'}
            />

            <div style={{
                position: 'sticky',
                top: 65, left: 0, right: 0,
                zIndex: 5, backgroundColor: 'white',
                paddingTop: '15px', paddingBottom: '15px',
                boxShadow: '0px 2px 5px #5555'
            }}>
                <div className="row">
                    <span className="col-md-auto">
                        <Button
                            variant="success"
                            onClick={() => setAddEmployeeModalVisible(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-plus-fill" viewBox="0 0 16 16">
                                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                            </svg> &nbsp; Add Employee
                        </Button>
                    </span>

                    <div className="col">
                        <div className="d-grid"
                        >
                            <Button
                                onClick={() => {
                                    setFiltersVisible((filtersVisible) ? false : true)
                                    if (filtersVisible) {
                                        setFiltersOverflowStyle({ overflow: 'hidden' });
                                    }
                                }}
                                variant={(filtersVisible) ? 'secondary' : 'primary'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel-fill" viewBox="0 0 16 16">
                                    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z" />
                                </svg> &nbsp; Filters
                            </Button>
                            <div
                                className={"filter-hover " + ((filtersVisible) ? 'is-open' : 'is-closed')}
                                onTransitionEnd={() => {
                                    if (filtersVisible) {
                                        setFiltersOverflowStyle({ overflow: 'visible' })
                                    }
                                }}
                                style={filtersOverflowStyle}
                            >
                                <InputGroup>
                                    <Form.Control
                                        placeholder={(currentFilterOption.value !== 0) ? currentFilterOption.label : 'First Name'}
                                        value={filterText}
                                        onChange={(e) => setFilterText(e.target.value)}
                                    />
                                    {(currentFilterOption.value === 0) ? (
                                        <Form.Control
                                            placeholder="Last Name"
                                            value={lastNameText}
                                            onChange={(e) => setLastNameText(e.target.value)}
                                        />
                                    ) : (<></>)}
                                    <Select
                                        value={currentFilterOption}
                                        options={filterTextOptions}
                                        onChange={(o) => setCurrentFilterOption(o)}
                                    />
                                    <DatePicker
                                        dateFormat={'yyyy/MM/dd'}
                                        selected={(empFilters.afterDate) ? new Date(empFilters.afterDate) : null}
                                        className="form-control"
                                        placeholderText="Hired After"
                                        isClearable={true}
                                        onChange={(date) => {
                                            if (date !== null) {
                                                setEmpFilters((f) => ({
                                                    ...f,
                                                    afterDate: date.toISOString()
                                                }))
                                            } else {
                                                setEmpFilters((f) => ({
                                                    ...f,
                                                    afterDate: null
                                                }))
                                            }
                                        }}
                                    />
                                    <DatePicker
                                        dateFormat={'yyyy/MM/dd'}
                                        selected={(empFilters.beforeDate) ? new Date(empFilters.beforeDate) : null}
                                        className="form-control"
                                        placeholderText="Hired Before"
                                        isClearable={true}
                                        onChange={(date) => {
                                            if (date !== null) {
                                                setEmpFilters((f) => ({
                                                    ...f,
                                                    beforeDate: date.toISOString()
                                                }))
                                            } else {
                                                setEmpFilters((f) => ({
                                                    ...f,
                                                    beforeDate: null
                                                }))
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            setFilterText('');
                                            setLastNameText('');
                                            setCurrentFilterOption(filterTextOptions[0]);
                                            setEmpFilters((f) => ({
                                                ...f,
                                                firstName: null,
                                                lastName: null,
                                                email: null,
                                                afterDate: null,
                                                beforeDate: null
                                            }));
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </InputGroup>
                                <InputGroup>
                                    <span className="col">
                                        <SelectDepartment
                                            placeholder="Filter by Department..."
                                            isClearable={true}
                                            onChange={(o) => {
                                                if (o != null) {
                                                    setEmpFilters((f) => ({
                                                        ...f,
                                                        departmentId: o.value
                                                    }));
                                                } else {
                                                    setEmpFilters((f) => ({
                                                        ...f,
                                                        departmentId: -1
                                                    }));
                                                }
                                            }}
                                        />
                                    </span>
                                </InputGroup>
                                <InputGroup>
                                    <span className="col">
                                        <SelectProjects
                                            placeholder="Filter by Projects..."
                                            isClearable={true}
                                            onChange={(o) => {
                                                if (o != null) {
                                                    let ids = [];
                                                    o.map((p) => ids.push(p.value));
                                                    setEmpFilters((f) => ({
                                                        ...f,
                                                        projectIds: (ids !== []) ? ids : null
                                                    }))
                                                } else {
                                                    setEmpFilters((f) => ({
                                                        ...f,
                                                        projectIds: null
                                                    }))
                                                }
                                            }}
                                        />
                                    </span>
                                </InputGroup>
                            </div>
                        </div>
                    </div>

                    <span className="col-md-auto">
                        <Button
                            variant="danger"
                            onClick={() => setDeleteAllModalVisible(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 17 17">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg> &nbsp; Delete All
                        </Button>
                    </span>
                </div>
            </div>

            <div className="col" style={{ position: 'relative', top: 15 }}>
                <Container>
                    {(!loading) ? (
                        <Accordion>
                            {(employees) ? (
                                employees.map((employee, index) => (
                                    <Accordion.Item eventKey={index} key={index}>
                                        <Accordion.Header>{employee.fullName}</Accordion.Header>
                                        <Accordion.Body>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item>
                                                    First Name: {employee.firstName}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Last Name: {employee.lastName}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Email: <a href={"mailto:" + employee.email}>{employee.email}</a>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Hire Date: {employee.hireDate}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Department: {employee.department.deptName}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Projects:
                                                    <span className="col">
                                                        {(employee.projects && employee.projects.length > 0) ? (
                                                            employee.projects.map((project, index) => (
                                                                <li
                                                                    className={
                                                                        "list-group-item"
                                                                    }
                                                                    key={index}
                                                                >
                                                                    {project.projName} ({project.department.deptName})
                                                                </li>
                                                            ))) : (' None')}
                                                    </span>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Button
                                                        variant="warning"
                                                        onClick={() => setEmployeeModalIndex(index)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                        </svg> Edit
                                                    </Button>

                                                    <Button
                                                        variant="danger"
                                                        onClick={() => setDeleteModalIndex(index)}
                                                        style={{ position: 'absolute', right: 8 }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 17 17">
                                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                                        </svg> Delete
                                                    </Button>
                                                </ListGroup.Item>
                                            </ListGroup>

                                            <EmployeeModal
                                                employee={employee}
                                                show={employeeModalIndex === index}
                                                onSubmit={retrieveEmployees}
                                                onHide={() => setEmployeeModalIndex(-1)}
                                            />

                                            <DeleteModal
                                                show={deleteModalIndex === index}
                                                onDelete={() => {
                                                    deleteEmployee(employee);
                                                    setDeleteModalIndex(-1);
                                                }}
                                                onCancel={() => setDeleteModalIndex(-1)}
                                                dataType={'Employee'}
                                                deleteAll={false}
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))) : (
                                <div
                                    style={{ textAlign: "center" }}
                                    className="form-control"
                                >
                                    Nothing to show...
                                </div>
                            )}
                        </Accordion>
                    ) : (
                        <div
                            className="row justify-content-center"
                        >
                            <Spinner
                                animation="border"
                                variant="primary"
                            />
                        </div>
                    )}
                </Container>
            </div>
        </div>
    );
}