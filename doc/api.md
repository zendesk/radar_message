# Radar Message API

The radar message API is broken into two parts:

* Request object and associated API
* Response object and associated API


## Request Object

A Request object is constructed from an input message, the constraints for which
are managed by the *_isValid* function.

In the event of an error when constructing a request object, the APIs implement
the following approach: ather than return an empty request object, or throw an
exception, the code instead *logs a warning or error* and returns as much of the
object as is valid.

In addition, in the event of an error, an *errMsg* property is added to the
object.  

The code that implements the request object and API is in
*lib/message_request.js*


## Response Object

A Response object is currently more minimal than a Request object, and the size
of the code reflects this.

In the event of an error when constructing a response object, the APIs log
errors and return an *empty* object literal.

In addition, in the event of an error, an *errMsg* property is added to the
object.  

The code that implements the request object and API is in
*lib/message_response.js*


## Generation of Request Objects

Applications that use the [radar_client API](https://github.com/zendesk/radar_client)
generate request objects by means of the request wrapper functions *buildGet*,
*buildSet*, etc., that are part of the radar message API.

In the near future, a radar HTTP client API will use the radar message API to
generate request objects for applications that are built using the
*radar_http_client* API.


## Generation of Response Objects

The *radar_client* API and [radar API](https://github.com/zendesk/radar) are
used by *client* and *server* applications respectively to build applications
that use radar for real-time messaging.

radar_client currently uses the the *radar_message* API to generate request
objects, **and in addition** the radar_client API also uses the radar_message
API to generate response objects.

Response objects are constructed, for example, from messages that are returned
to a client application from a server application.  In our case, radar returns a
message to radar_client, and radar_client uses radar_message to construct a
response object within radar_client.

We will soon use and extend radar_message to use it with *radar* so that we
are handling *request* and *response* objects instead of raw messages.
