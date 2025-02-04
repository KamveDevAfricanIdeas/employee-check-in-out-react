import '../../styles/dropdown.style.css'

export default function DropdownMenu() {
    return (
        <div className="dropdown-menu">
            <label for="employees">Select your name:</label> {/* these values should be loaded from the CosmosDB */}
            <select name="employees" id="employees">
                <option value="Kamve">Kamve</option>
                <option value="John">John</option>
                <option value="Mimi">Mimi</option>
                <option value="Eric">Eric</option>
            </select>
        </div>
    )
}