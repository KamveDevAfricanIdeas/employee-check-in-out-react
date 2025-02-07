const { app } = require('@azure/functions');
const { CosmosClient } = require("@azure/cosmos");
//partition key: /EmployeeName

// Allow self-signed certificates (Only for local development)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const cosmosClient = new CosmosClient({
    endpoint: process.env.COSMOSDB_ENDPOINT,
    key: process.env.COSMOSDB_KEY
});
const databaseId = 'EmployeeCheckins';
const checkinContainerId = 'EmployeesContainer';
const employeeListContainerId = 'EmployeesList';

var cors = require('cors');

app.http('CosmosDBFunction', {
    methods: ['GET', 'POST', 'PUT'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        //context.log(`Http function processed request for url "${request.url}"`);
        context.log(`The request method was: "${request.method}"`);

        const database = cosmosClient.database(databaseId);
        const checkinContainer = database.container(checkinContainerId);
        const employeeListContainer = database.container(employeeListContainerId);
        
        try {
            switch (request.method) {
                case "GET": {
                    // Fetch all employees
                    const { resources: items } = await checkinContainer.items.readAll().fetchAll();
                    const { resources: getEmployees } = await employeeListContainer.items.readAll().fetchAll();
                    return {
                        status: 200,
                        body: JSON.stringify({items, getEmployees}, null, 2),
                        headers: { "Content-Type": "application/json" }
                    };
                }
                case "POST": {
                    // Insert a new check-in
                    context.log("Attempting to insert a new check in record...");
                    const newCheckin = await request.json();
                    const { resource: checkInResult } = await checkinContainer.items.create(newCheckin.items);
                    context.log(newCheckin.items);
                    return {
                        status: 201,
                        body: JSON.stringify(checkInResult),
                        headers: { "Content-Type": "application/json" }
                    };
                }
                case "PUT": {
                    //CURRENTLY ACCESSING THE FIRST ELEMENT IN THE RETURN json Object items: {[{}, {}, {}]}
                    const newCheckout = await request.json();
                    const id = newCheckout.items[0].id;
                    const partitionKey = newCheckout.items[0].EmployeeName;

                    context.log("Attempting to update the checkin record here...:");
                    context.log("The fetched update data: ", newCheckout.items[0].EmployeeName);
                    if (!id || !partitionKey) {
                        return {
                            status: 404,
                            body: JSON.stringify({ message: `Item not found with id and partition key` }),
                        };
                    }
                    const { resource: existingItem } = await checkinContainer.item(id, partitionKey).read(); //.item(documentId, partitionKey)
                    context.log(await checkinContainer.item(id, partitionKey).read());
                    context.log("Existing item: ", checkinContainer);

                    if(!existingItem){
                        return {
                            status: 404, body: JSON.stringify({message: "Item does not Exist!"})
                        };
                    }
                    const updatedItem = { ...existingItem, ...newCheckout.items };
                    const { resource: result } = await checkinContainer.item(id, partitionKey).replace(updatedItem);
                
                    return {
                        status: 200,
                        body: JSON.stringify(result),
                        headers: { "Content-Type": "application/json" },
                    };
                }
                default:
                    return { status: 405, body: 'Method Not Allowed' };
            }
        }catch (error) {
            console.log(`Error: ${error.message}`);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});