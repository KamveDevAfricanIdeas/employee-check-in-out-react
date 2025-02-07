import '../../styles/dropdown.style.css'
import { v4 as uuidv4 } from 'uuid';
import React, {useEffect, useState} from 'react';
import userIcon from '../../assets/default_user_icon.png';

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
            <div className="user-detail-container">
                <img className="userIcon" src={userIcon}></img>
                <h4 key={uuidv4()}>Name: {userName}</h4>
                <h4 key={uuidv4()}>Id: {selectedEmployeeId}</h4>
                {/* <p key={uuidv4()}>Employee Number: {dummy_data[0].EmployeeId}</p> */}
                {/* <p key={uuidv4()}>Last Check in: {dummy_data[0].CheckTime}</p> */}
            </div>
            <div className="dropdown-menu">
                <select value={selectedEmployeeId} onChange={changeUser} name="employees" id="employees">
                    <option value="" disabled>Change User</option>
                    {list.map( (employee) => (
                        <option key={employee.id} value={employee.id}>
                            {employee.EmployeeId + " " + employee.EmployeeName}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}