import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import EMS from "./components/ems.component";
import EmployeesList from "./components/employee-list.component";
import ProjectsList from "./components/project-list.component";
import DepartmentsList from "./components/department-list.component";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";

function App() {
    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark" sticky="top">
                <Navbar.Brand
                    href="/"
                    className="px-3 py-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    </svg> EMS
                </Navbar.Brand>
                <Nav className="me-auto pr-2 py-1">
                    <Nav.Link
                        href="/employees"
                        className={(window.location.pathname === "/employees") ? "nav-item active" : "nav-item"}
                    >
                        Employees
                    </Nav.Link>
                    <Nav.Link
                        href="/projects"
                        className={(window.location.pathname === "/projects") ? "nav-item active" : "nav-item"}
                    >
                        Projects
                    </Nav.Link>
                    <Nav.Link
                        href="/departments"
                        className={(window.location.pathname === "/departments") ? "nav-item active" : "nav-item"}
                    >
                        Departments
                    </Nav.Link>
                </Nav>
                {(window.location.pathname !== "/") ? (
                    <Button
                        className="mx-3"
                        variant="dark"
                        onClick={() => {
                            const refreshEvent = new Event('onRefresh');
                            document.dispatchEvent(refreshEvent)
                        }}
                    >
                        Refresh
                    </Button>
                ) : (<></>)}
            </Navbar>

            <div className="container-fluid" style={{ paddingBottom: '30px' }}>
                <Routes>
                    <Route path="/" element={<EMS />} />
                    <Route path="/employees" element={<EmployeesList />} />
                    <Route path="/projects" element={<ProjectsList />} />
                    <Route path="/departments" element={<DepartmentsList />} />
                </Routes>
            </div>

            <div
                className="container-fluid mx-0 px-0"
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL + "/bg1.jpg"})`,
                    backgroundAttachment: 'fixed',
                    backgroundSize: 'cover',
                    position: 'fixed',
                    zIndex: -1,
                    top: 0,
                    bottom: 0
                }}
            ></div>
        </div>
    );
}

export default App;