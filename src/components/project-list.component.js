import { useState, useEffect } from "react";
import ProjectDataService from "../services/project.service";

import { Form, InputGroup, Accordion, ListGroup, Button, Container, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import SelectDepartment from "./select-department.component";
import DeleteModal from "./delete-all-modal.component";
import ProjectModal from "./project-modal.component";
import SelectEmployees from "./select-employees.component";

export default function ProjectsList() {
    const [projects, setProjects] = useState(null);
    const [projFilters, setProjFilters] = useState({
        projName: null,
        startAfter: null,
        startBefore: null,
        endAfter: null,
        endBefore: null,
        departmentId: -1,
        employeeIds: null
    });
    const [addProjectModalVisible, setAddProjectModalVisible] = useState(false);
    const [deleteAllModalVisible, setDeleteAllModalVisible] = useState(false);
    const [projectModalIndex, setProjectModalIndex] = useState(-1);
    const [deleteModalIndex, setDeleteModalIndex] = useState(-1);

    const [filtersVisible, setFiltersVisible] = useState(false);
    const [filtersOverflowStyle, setFiltersOverflowStyle] = useState({ overflow: 'hidden' });
    const [projNameText, setProjNameText] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.addEventListener('onRefresh', retrieveProjects);
        return () => document.removeEventListener('onRefresh', retrieveProjects)
    }, []);

    useEffect(() => {
        setProjectModalIndex(-1);
        setDeleteModalIndex(-1);
        retrieveProjects();
    }, [projFilters]);

    useEffect(() => {
        setProjFilters((f) => ({
            ...f,
            projName: (projNameText !== '') ? projNameText : null
        }));
        console.log('proj name filter updated');
    }, [projNameText]);

    function retrieveProjects() {
        setLoading(true);
        console.log(projFilters);
        ProjectDataService.filter(projFilters)
            .then(response => {
                if (response.data) {
                    response.data.map((project, index) => {
                        ProjectDataService.getEmployees(project.id)
                            .then(responseEmp => {
                                project.employees = responseEmp.data;
                            })
                            .catch(e => {
                                console.log(e);
                            });
                    });
                }
                setProjects(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
        setTimeout(() => {
            setLoading(false);
        }, 200);
    }

    function deleteProject(project) {
        setDeleteModalIndex(-1);
        ProjectDataService.delete(project.id)
            .then(response => {
                console.log(response.data);
                retrieveProjects();
            })
            .catch(e => {
                console.log(e);
            })
    }

    function deleteAllProjects() {
        ProjectDataService.deleteAll()
            .then(response => {
                console.log(response.data);
                retrieveProjects();
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
        <div className="row">
            <ProjectModal
                show={addProjectModalVisible}
                onSubmit={retrieveProjects}
                onHide={() => setAddProjectModalVisible(false)}
            />

            <DeleteModal
                dataType={'Project'}
                show={deleteAllModalVisible}
                onDelete={() => {
                    deleteAllProjects();
                    setDeleteAllModalVisible(false);
                }}
                onCancel={() => setDeleteAllModalVisible(false)}
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
                            onClick={() => setAddProjectModalVisible(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-bar-graph-fill" viewBox="0 0 16 16">
                                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm.5 10v-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-2.5.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1zm-3 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1z" />
                            </svg> &nbsp; Add Project
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
                                        placeholder={'Project Name'}
                                        value={projNameText}
                                        onChange={(e) => setProjNameText(e.target.value)}
                                    />
                                    <DatePicker
                                        dateFormat={'yyyy/MM/dd'}
                                        selected={(projFilters.startAfter) ? new Date(projFilters.startAfter) : null}
                                        className="form-control"
                                        placeholderText="Started After"
                                        isClearable={true}
                                        onChange={(date) => {
                                            setProjFilters((f) => ({
                                                ...f,
                                                startAfter: (date) ? date.toISOString() : null
                                            }))
                                        }}
                                    />
                                    <DatePicker
                                        dateFormat={'yyyy/MM/dd'}
                                        selected={(projFilters.startBefore) ? new Date(projFilters.startBefore) : null}
                                        className="form-control"
                                        placeholderText="Started Before"
                                        isClearable={true}
                                        onChange={(date) => {
                                            setProjFilters((f) => ({
                                                ...f,
                                                startBefore: (date) ? date.toISOString() : null
                                            }))
                                        }}
                                    />
                                    <DatePicker
                                        dateFormat={'yyyy/MM/dd'}
                                        selected={(projFilters.endAfter) ? new Date(projFilters.endAfter) : null}
                                        className="form-control"
                                        placeholderText="Ended After"
                                        isClearable={true}
                                        onChange={(date) => {
                                            setProjFilters((f) => ({
                                                ...f,
                                                endAfter: (date) ? date.toISOString() : null
                                            }))
                                        }}
                                    />
                                    <DatePicker
                                        dateFormat={'yyyy/MM/dd'}
                                        selected={(projFilters.endBefore) ? new Date(projFilters.endBefore) : null}
                                        className="form-control"
                                        placeholderText="Ended Before"
                                        isClearable={true}
                                        onChange={(date) => {
                                            setProjFilters((f) => ({
                                                ...f,
                                                endBefore: (date) ? date.toISOString() : null
                                            }))
                                        }}
                                    />
                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            setProjNameText('');
                                            setProjFilters((f) => ({
                                                ...f,
                                                projName: null,
                                                startAfter: null,
                                                startBefore: null,
                                                endAfter: null,
                                                endBefore: null
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
                                                setProjFilters((f) => ({
                                                    ...f,
                                                    departmentId: (o) ? o.value : null
                                                }))
                                            }}
                                        />
                                    </span>
                                </InputGroup>
                                <InputGroup>
                                    <span className="col">
                                        <SelectEmployees
                                            placeholder="Filter by Employees..."
                                            isClearable={true}
                                            onChange={(o) => {
                                                if (o != null) {
                                                    let ids = [];
                                                    o.map((e) => ids.push(e.value));
                                                    setProjFilters((f) => ({
                                                        ...f,
                                                        employeeIds: (ids !== []) ? ids : null
                                                    }));
                                                } else {
                                                    setProjFilters((f) => ({
                                                        ...f,
                                                        employeeIds: null
                                                    }));
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
                            {(projects) ? (
                                projects.map((project, index) => (
                                    <Accordion.Item eventKey={index} key={index}>
                                        <Accordion.Header>{project.projName}</Accordion.Header>
                                        <Accordion.Body>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item>
                                                    Project Name: {project.projName}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Start Date: {project.startDate}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Expected End Date: {project.endDate}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Department: {project.department.deptName}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Employees:
                                                    <span className="col">
                                                        {(project.employees && project.employees.length > 0) ? (
                                                            project.employees.map((employee, index) => (
                                                                <li
                                                                    className={"list-group-item"}
                                                                    key={index}
                                                                >
                                                                    {employee.fullName} ({employee.department.deptName})
                                                                </li>
                                                            ))) : (' None')}
                                                    </span>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Button
                                                        variant="warning"
                                                        onClick={() => setProjectModalIndex(index)}
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

                                            <ProjectModal
                                                project={project}
                                                show={projectModalIndex === index}
                                                onSubmit={retrieveProjects}
                                                onHide={() => setProjectModalIndex(-1)}
                                            />

                                            <DeleteModal
                                                show={deleteModalIndex === index}
                                                onDelete={() => {
                                                    deleteProject(project);
                                                    setDeleteModalIndex(-1);
                                                }}
                                                onCancel={() => setDeleteModalIndex(-1)}
                                                dataType={'Project'}
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