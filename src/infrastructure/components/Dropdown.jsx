import '../../styles/dropdown.style.css'
import { v4 as uuidv4 } from 'uuid';
import React, {useEffect, useState} from 'react';

export default function DropdownMenu( {list=[]} ) {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [userName, setName] = useState("");

    const changeUser = (event) => {
        const selectedId = event.target.value;
        setSelectedEmployeeId(selectedId);
        const selectedEmployeeObject = list.find((employee) => employee.id === selectedId);
        setSelectedEmployee(selectedEmployeeObject);

        //getUser(selectedEmployeeObject);
    };
    useEffect( () => {
        if (selectedEmployee !=null){
            console.log("Changed user select");
            console.log(selectedEmployee.EmployeeName, "---", selectedEmployee.id);
            setName(selectedEmployee.EmployeeName);
        }
    }, [selectedEmployee]);

    return (
        <>
            <div className="dropdown-menu">
                <label for="employees">Select your name:</label>
                <select value={selectedEmployeeId} onChange={changeUser} name="employees" id="employees">
                    {list.map( (employee) => (
                        <option key={employee.id} value={employee.id}>
                            {employee.EmployeeId + " " + employee.EmployeeName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <strong>Your Details: </strong>
                <div>
                    <p key={uuidv4()}>Name: {userName}</p>
                    <p key={uuidv4()}>Id: {selectedEmployeeId}</p>
                    {/* <p key={uuidv4()}>Employee Number: {dummy_data[0].EmployeeId}</p> */}
                    {/* <p key={uuidv4()}>Last Check in: {dummy_data[0].CheckTime}</p> */}
                </div>
            </div>
        </>
    )
}