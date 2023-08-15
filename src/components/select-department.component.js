import { useEffect, useState } from "react";
import DepartmentDataService from "../services/department.service";

import Select from 'react-select';

function SelectDepartment({ onChange = null, defaultDeptId = null, placeholder = 'Select Department...', 
    isClearable = false, isValid = true }) {

    const [deptOpts, setDeptOpts] = useState(null);
    const [defOpt, setDefOpt] = useState(null);

    function generateDepartmentsOptions(deptId) {
        let depts = [];
        DepartmentDataService.getAll()
            .then(response => {
                response.data.map((dept) => {
                    let opt = { value: dept.id, label: dept.deptName + ' (' + dept.location + ')' };
                    depts.push(opt);
                    if (deptId != null && deptId == dept.id) {
                        setDefOpt(opt);
                    }
                })
            })
            .catch(e => {
                console.log(e);
            });
        console.log(depts);
        setDeptOpts(depts);
    }

    useEffect(() => {
        generateDepartmentsOptions(defaultDeptId);
    }, []);

    if ((defaultDeptId != null && defOpt == null) ||
        (defaultDeptId == null && deptOpts == null)) {
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
                placeholder={placeholder}
                isClearable={isClearable}
                defaultValue={defOpt}
                onChange={(item) => onChange(item)}
                options={deptOpts}
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

export default SelectDepartment;