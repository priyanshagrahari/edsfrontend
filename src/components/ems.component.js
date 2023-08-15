import { Button, Card } from 'react-bootstrap';
import DepartmentDataService from "../services/department.service";
import { useEffect, useState } from 'react';

function EMS() {
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        checkDeptCount();
    }, []);

    function checkDeptCount() {
        DepartmentDataService.getAll()
            .then((response) => {
                if (response === null || response.data.length === 0) {
                    setIsNew(true);
                }
            });
    }

    return (
        <div>
            <Card
                style={{
                    position: 'absolute',
                    right: '30px',
                    top: '95px',
                    marginLeft: '30px'
                }}
            >
                <Card.Body>
                    <Card.Title>Welcome to EMS!</Card.Title>
                    <Card.Text>
                        A simple employee database management system made using <br />
                        ReactJS, Spring JPA, and PostgreSQL <br /><br />

                        Use the navbar on the top to navigate. <br />
                        {(isNew) ? ('Add your first department entry to get started!') : ''}
                    </Card.Text>
                    {(isNew) ? (
                        <Button href='/departments' variant="success">
                            Departments
                        </Button>
                    ) : (<></>)}
                </Card.Body>
                <Card.Footer className="text-muted">Made by Priyansh Agrahari</Card.Footer>
            </Card>
        </div>
    );
}

export default EMS;