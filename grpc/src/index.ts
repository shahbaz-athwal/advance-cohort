import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../person.proto'));

const personProto = grpc.loadPackageDefinition(packageDefinition);

const PERSONS = [
    {
        name: "harkirat",
        age: 45
    },
    {
      name: "raman",
      age: 45
    },
];

//@ts-ignore
function addPerson(call, callback) {
  console.log(call)
    let person = {
      name: call.request.name,
      age: call.request.age
    }
    PERSONS.push(person);
    callback(null, person)
}

const server = new grpc.Server();

//@ts-ignore
server.addService(personProto.AddressBookService.service, { addPerson: addPerson });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {

    server.start();
});