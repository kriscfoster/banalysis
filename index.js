var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
console.log(__dirname + '/src/main/protobuf')

process.on('warning', (warning) => {
  console.warn("warning name - " + warning.name);
  console.warn("warning message - " + warning.message);
});

var packageDefinition = protoLoader.loadSync(
  'build_event_stream.proto',
  {
    keepCase: true,
    defaults: true,
    enums: String,
    oneofs: true,
    includeDirs: [__dirname + '/src/main/protobuf/']
  }
);
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  console.log('here');
  callback(null, {message: 'Hello ' + call.request.name});
}

(function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {sayHello: sayHello});
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    
    console.log('starting');
  });
})()
