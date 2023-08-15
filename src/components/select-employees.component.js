import { useEffect, useState } from "react";
import EmployeeDataService from "../services/employee.service";

import Select from 'react-select';

function SelectEmployees({ onChange = null, defaultEmpIds = null, placeholder = 'Select Employees...',
    isClearable = false, isValid = true }) {
    const [empOpts, setEmpOpts] = useState(null);
    const [defOpts, setDefOpts] = useState(null);

    function generateEmployeesOptions(empIds) {
        let emps = [];
        EmployeeDataService.getAll()
            .then(response => {
                let selOpts = [];
                console.log(empIds);
                (response.data &&
                    response.data.map((emp) => {
                        let opt = { value: emp.id, label: emp.fullName + ' (' + emp.department.deptName + ')' };
                        emps.push(opt);
                        if (empIds != null && empIds.includes(emp.id)) {
                            selOpts.push(opt);
                        }
                    })
                )
                setDefOpts(selOpts);
            })
            .catch(e => {
                console.log(e);
            });
        console.log(emps);
        setEmpOpts(emps);
    }

    useEffect(() => {
        generateEmployeesOptions(defaultEmpIds);
    }, []);

    if ((defaultEmpIds != null && defOpts == null) ||
        (defaultEmpIds == null && empOpts == null)) {
        return (
            <span className="form-control">
                Loading...
            </span>
        );
    }
    else {
        return (
            <Select
                required
                isMulti
                placeholder={placeholder}
                isClearable={isClearable}
                defaultValue={defOpts}
                onChange={(items) => onChange(items)}
                options={empOpts}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles, 
                        borderColor: state.isFocused ? 'blue' : ((!isValid) ? 'darkred' : 'lightgrey')
                    })
                }}
            />
        );
    }
}

export default SelectEmployees;