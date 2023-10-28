import { HttpException, Injectable } from '@nestjs/common';

type HttpErrorStatusType =
  | '400'
  | '401'
  | '402'
  | '403'
  | '404'
  | '405'
  | '406'
  | '408'
  | '409';

@Injectable()
export class ErrorResService {
  HttpExe = (msg: string, status: HttpErrorStatusType) => {
    return new HttpException(
      {
        status: Number(status),
        msg,
      },
      Number(status),
    );
  };

  // The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
  ExcBadRequest = (msg: string) => this.HttpExe(msg, '400');

  // Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
  ExcUnauthorized = (msg: string) => this.HttpExe(msg, '401');

  // This response code is reserved for future use. The initial aim for creating this code was using it for digital payment systems, however this status code is used very rarely and no standard convention exists.
  ExcPaymentRequired = (msg: string) => this.HttpExe(msg, '403');

  // The server can not find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.
  ExcNotFound = (msg: string) => this.HttpExe(msg, '404');

  // The request method is known by the server but is not supported by the target resource. For example, an API may not allow calling DELETE to remove a resource.
  ExcMethodNotAllowed = (msg: string) => this.HttpExe(msg, '405');

  // This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.
  ExcNotAcceptable = (msg: string) => this.HttpExe(msg, '406');

  // This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
  ExcRequestTimeout = (msg: string) => this.HttpExe(msg, '408');

  // This response is sent when a request conflicts with the current state of the server.
  ExcConflict = (msg: string) => this.HttpExe(msg, '409');
}
