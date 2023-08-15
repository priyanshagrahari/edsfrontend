import { useEffect, useState } from "react";
import ProjectDataService from "../services/project.service";

import Select from 'react-select';

export default function SelectProjects({ onChange = null, defaultProjIds = null, placeholder = 'Select Projects...', 
    isClearable = false, isValid = true }) {
    const [projOpts, setProjOpts] = useState(null);
    const [defOpts, setDefOpts] = useState(null);

    function generateProjectsOptions(projIds) {
        let projs = [];
        ProjectDataService.getAll()
            .then(response => {
                let selOpts = [];
                console.log(projIds);
                (response.data &&
                    response.data.map((proj) => {
                        let opt = { value: proj.id, label: proj.projName + ' (' + proj.department.deptName + ')' };
                        projs.push(opt);
                        if (projIds != null && projIds.includes(proj.id)) {
                            selOpts.push(opt);
                        }
                    })
                )
                setDefOpts(selOpts);
            })
            .catch(e => {
                console.log(e);
            });
        console.log(projs);
        setProjOpts(projs);
    }

    useEffect(() => {
        generateProjectsOptions(defaultProjIds);
    }, []);

    if ((defaultProjIds != null && defOpts == null) ||
        (defaultProjIds == null && projOpts == null)) {
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
                isClearable={isClearable}
                placeholder={placeholder}
                defaultValue={defOpts}
                onChange={(items) => onChange(items)}
                options={projOpts}
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