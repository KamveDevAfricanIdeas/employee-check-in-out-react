const { app } = require('@azure/functions');
//const client = new CosmosClient({ endpoint: process.env["COSMOSDB_ENDPOINT"], key: process.env["COSMOSDB_KEY"] });

app.http('CosmosDBFunction', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        
        const name = request.query.get('name') || await request.text() || 'Kamve';

        return { body: `Hello, ${name}!` };
    }
});

/* 
const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient({ endpoint: process.env["COSMOSDB_ENDPOINT"], key: process.env["COSMOSDB_KEY"] });

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const database = client.database("SWAStore");
    const container = database.container("Items");

    if(req.method === "GET"){ //return all items
        try {
            const { resources } = await container.items.readAll().fetchAll();
            context.res = {
                status: 200,
                body: resources
            };
        } catch (error) {
            context.res = {
                status: 500,
                body: `Error retrieving items from the database: ${error.message}`
            };
        }
    }
	//[ POST, PUT AND DELETE ENDPOINTS OMITTED FOR SIMPLICITY, AVAILABLE IN SOURCE CODE ] 
else {
        context.res = {
            status: 405,
            body: "Method Not Allowed"
        };
    }
}
*/