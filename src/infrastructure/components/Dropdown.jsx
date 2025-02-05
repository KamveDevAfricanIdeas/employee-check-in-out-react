import '../../styles/dropdown.style.css'
const dummy_data = [
    {
      "id": "1",
      "EmployeeId": "E123",
      "EmployeeName": "Timmy Wayne",
      "CheckTime": "2025/02/04 07:00:00",
    },
    {
      "id": "2",
      "EmployeeId": "E003",
      "EmployeeName": "Druski Martin",
      "CheckTime": "2025/02/05 07:00:00",
    }
];

export default function DropdownMenu( {list=dummy_data} ) {
    return (
        <div className="dropdown-menu">
            <label for="employees">Select your name:</label> {/* these values should be loaded from the CosmosDB */}
            <select name="employees" id="employees">
                {/* loop over the names array */}
                {list.map( (employee) => (
                    <option key={employee.EmployeeId}>
                        {employee.EmployeeName}
                    </option>
                ))}
            </select>
        </div>
    )
}