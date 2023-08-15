import { useState, useEffect } from "react";
import DepartmentDataService from "../services/department.service";

import { Form, InputGroup, Accordion, ListGroup, Button, Container, Spinner } from "react-bootstrap";

import DeleteModal from "./delete-all-modal.component";
import DepartmentModal from "./department-modal.component";

export default function DepartmentsList() {
    const [departments, setDepartments] = useState([]);
    const [deptFilters, setDeptFilters] = useState({
        deptName: null,
        location: null
    });
    const [addDepartmentModalVisble, setAddDepartmentModalVisible] = useState(false);
    const [deleteAllModalVisible, setDeleteAllModalVisible] = useState(false);
    const [departmentModalIndex, setDepartmentModalIndex] = useState(-1);
    const [deleteModalIndex, setDeleteModalIndex] = useState(-1);

    const [deptNameText, setDeptNameText] = useState('');
    const [locationText, setLocationText] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.addEventListener('onRefresh', retrieveDepartments);
        return () => document.removeEventListener('onRefresh', retrieveDepartments)
    }, []);

    useEffect(() => {
        retrieveDepartments();
        setDepartmentModalIndex(-1);
        setDeleteModalIndex(-1);
    }, [deptFilters]);

    useEffect(() => {
        setDeptFilters({
            deptName: (deptNameText !== '') ? deptNameText : null,
            location: (locationText !== '') ? locationText : null
        })
    }, [deptNameText, locationText]);

    function retrieveDepartments() {
        setLoading(true);
        console.log(deptFilters);
        DepartmentDataService.filter(deptFilters)
            .then(response => {
                setDepartments(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
        setTimeout(() => {
            setLoading(false);
        }, 200);
    }

    function deleteDepartment(department) {
        setDeleteModalIndex(-1);
        DepartmentDataService.delete(department.id)
            .then(response => {
                console.log(response.data);
                retrieveDepartments();
            })
            .catch(e => {
                console.log(e);
            });
    }

    function deleteAllDepartments() {
        DepartmentDataService.deleteAll()
            .then(response => {
                console.log(response.data);
                retrieveDepartments();
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
        <div className="row">
            <DepartmentModal
                show={addDepartmentModalVisble}
                onSubmit={retrieveDepartments}
                onHide={() => setAddDepartmentModalVisible(false)}
            />

            <DeleteModal
                show={deleteAllModalVisible}
                onDelete={() => {
                    deleteAllDepartments();
                    setDeleteAllModalVisible(false);
                }}
                onCancel={() => setDeleteAllModalVisible(false)}
                dataType={'Department'}
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
                            onClick={() => setAddDepartmentModalVisible(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-building-fill-add" viewBox="0 0 16 16">
                                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Z" />
                                <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7.256A4.493 4.493 0 0 0 12.5 8a4.493 4.493 0 0 0-3.59 1.787A.498.498 0 0 0 9 9.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .39-.187A4.476 4.476 0 0 0 8.027 12H6.5a.5.5 0 0 0-.5.5V16H3a1 1 0 0 1-1-1V1Zm2 1.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5Zm3 0v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5Zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1ZM4 5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5ZM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm2.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5ZM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Z" />
                            </svg> &nbsp; Add Department
                        </Button>
                    </span>

                    <div className="col">
                        <div className="d-grid"
                        >
                            <div
                                className={"filter-hover is-open"}
                            >
                                <InputGroup>
                                    <Form.Control
                                        placeholder={'Department Name'}
                                        value={deptNameText}
                                        onChange={(e) => setDeptNameText(e.target.value)}
                                    />

                                    <Form.Control
                                        placeholder={'Location'}
                                        value={locationText}
                                        onChange={(e) => setLocationText(e.target.value)}
                                    />

                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            setDeptNameText('');
                                            setLocationText('');
                                        }}
                                    >
                                        Clear
                                    </Button>
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
                            {(departments) ? (
                                departments.map((department, index) => (
                                    <Accordion.Item eventKey={index} key={index}>
                                        <Accordion.Header>{department.deptName}</Accordion.Header>
                                        <Accordion.Body>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item>
                                                    Department Name: {department.deptName}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    Location: {department.location}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Button
                                                        variant="warning"
                                                        onClick={() => setDepartmentModalIndex(index)}
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

                                            <DepartmentModal
                                                department={department}
                                                show={departmentModalIndex === index}
                                                onSubmit={retrieveDepartments}
                                                onHide={() => setDepartmentModalIndex(-1)}
                                            />

                                            <DeleteModal
                                                show={deleteModalIndex === index}
                                                onDelete={() => {
                                                    deleteDepartment(department);
                                                    setDeleteModalIndex(-1);
                                                }}
                                                onCancel={() => setDeleteModalIndex(-1)}
                                                dataType={'Department'}
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