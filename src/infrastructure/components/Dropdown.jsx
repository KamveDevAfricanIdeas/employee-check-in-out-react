import '../../styles/dropdown.style.css'
import { v4 as uuidv4 } from 'uuid';
import React, {useEffect, useState} from 'react';

export default function DropdownMenu( { list=[], checkinList=[], setSelectedEmployee } ) {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

    const changeUser = (event) => {
        const selectedId = event.target.value;
        setSelectedEmployeeId(selectedId);
        const selectedEmployeeObject = checkinList.find((employee) => employee.EmployeeNumber === selectedId);
        setSelectedEmployee(selectedEmployeeObject);
    };

    return (
        <>
            <div className="dropdown-menu">
                <select value={selectedEmployeeId} onChange={changeUser} name="employees" id="employees">
                    <option value="" disabled>Change User</option>
                    {list.map( (employee) => (
                        <option key={employee.EmployeeNumber} value={employee.EmployeeNumber}>
                            {employee.EmployeeNumber} {employee.EmployeeName}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}