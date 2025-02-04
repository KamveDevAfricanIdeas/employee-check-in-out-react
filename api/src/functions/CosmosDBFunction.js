const { app } = require('@azure/functions');
const { CosmosClient } = require("@azure/cosmos");
/*
const cosmosClient = new CosmosClient({
    endpoint: process.env.COSMOSDB_ENDPOINT,
    key: process.env.COSMOSDB_KEY
});

const databaseId = 'YourDatabaseName';
const containerId = 'YourContainerName'; */

app.http('CosmosDBFunction', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        return { body: `Hello, Kamve` }; 

        const database = cosmosClient.database(databaseId);
        const container = database.container(containerId);
        
        //handle different request methods:
        
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
    }
});
/* 
const name = request.query.get('name') || await request.text() || 'Kamve';
return { body: `Hello, ${name}!` }; 
*/
