import { client, connectToDb } from './connection.js';
import CLI from './CLI.js';

await connectToDb();

const cli = new CLI(client);

//Start the command line interface.
cli.startUp();



