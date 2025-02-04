const { app } = require('@azure/functions');
const { CosmosClient } = require("@azure/cosmos");
//partition key: /EmployeeId

// Allow self-signed certificates (Only for local development)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const cosmosClient = new CosmosClient({
    endpoint: process.env.COSMOSDB_ENDPOINT,
    key: process.env.COSMOSDB_KEY
});
const databaseId = 'employee_check_in_out';
const containerId = 'employees';

app.http('CosmosDBFunction', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        
        const database = cosmosClient.database(databaseId);
        const container = database.container(containerId);
        
        try {
            switch (request.method) {
                case 'GET': {
                    // Fetch all employees
                    const { resources: items } = await container.items.readAll().fetchAll();
                    return {
                        status: 200,
                        body: JSON.stringify(items, null, 2),
                        headers: { "Content-Type": "application/json" }
                    };
                }
    
                case 'POST': {
                    // Insert a new check-in
                    const newCheckin = await request.json();
                    const { resource: checkInResult } = await container.items.create(newCheckin);
                    return {
                        status: 201,
                        body: JSON.stringify(checkInResult),
                        headers: { "Content-Type": "application/json" }
                    };
                }
    
                case 'PUT': {
                    // Update check-out
                    const newCheckout = await request.json();
                    const { id, EmployeeId } = newCheckout;
                    if (!id || !EmployeeId) {
                        return { status: 400, body: "Missing 'id' or 'EmployeeId'" };
                    }

                    const { resource: checkOutResult } = await container
                        .item(id, EmployeeId)
                        .replace(newCheckout);

                    return {
                        status: 200,
                        body: JSON.stringify(checkOutResult),
                        headers: { "Content-Type": "application/json" }
                    };
                }
    
                case 'DELETE': {
                    // Delete an employee record
                    const { id, EmployeeId } = request.query;
                    if (!id || !EmployeeId) {
                        return { status: 400, body: "Missing 'id' or 'EmployeeId'" };
                    }

                    await container.item(id, EmployeeId).delete();
                    return {
                        status: 204,
                        body: `Employee check-in record with id ${id} deleted`
                    };
                }
                default:
                    return { status: 405, body: 'Method Not Allowed' };
            }
        }catch (error) {
            context.log(`Error: ${error.message}`);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});
/* 
const name = request.query.get('name') || await request.text() || 'Kamve';
return { body: `Hello, ${name}!` }; 
*/
/* switch (request.method) {
            case 'GET':
                // Handle GET request
                const { resources: employees } = await container.employees.readAll().fetchAll();
                return { body: JSON.stringify(employees) };

            case 'POST':
                // Handle POST request
                const newCheckin = await request.json();
                const { resource: checkInResult } = await container.newCheckin.create(newCheckin);
                return { body: JSON.stringify(checkInResult) };

            case 'PUT':
                // Handle PUT request
                const newCheckout = await request.json(); //updating means checking out
                const { resource: checkOutResult } = await container.item(newCheckout.id).replace(newCheckout);
                return { body: JSON.stringify(checkOutResult) };

            case 'DELETE':
                // Handle DELETE request
                const employeeId = request.query.get('id');
                await container.item(employeeId).delete();
                return { body: `Employee check-in records with id ${employeeId} deleted` };

            default:
                return { status: 405, body: 'Method Not Allowed' };
        } */

//SAMPLE JSON DATA:
/* {
    "id": "1",
    "EmployeeId": "E123",
    "EmployeeName": "John Doe",
    "CheckTime": "2025/02/04 07:00:00",
    "_rid": "in08ALP-HYECAAAAAAAAAA==",
    "_self": "dbs/in08AA==/colls/in08ALP-HYE=/docs/in08ALP-HYECAAAAAAAAAA==/",
    "_etag": "\"00000000-0000-0000-7707-3dfdfccd01db\"",
    "_attachments": "attachments/",
    "_ts": 1738675092
  } */