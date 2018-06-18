'use strict';

/*
    key
    status_code         HTTP STATUS CODE (https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
    code                An error code. Common values are listed below, along with common recovery tactics
    message             A human-readable description of the error for developer.
    type                The type of error returned. e.g. api_connection_error, api_error, authentication_error, idempotency_error, invalid_request_error
    error_user_title    The title of the dialog, if shown. The language of the message is based on the locale of the API request.
    error_user_msg      The message to display to the user. The language of the message is based on the locale of the API request.
*/
module.exports = {
    // INV_SLEN: 'String is too short or too long',
    // INV_CHAR: 'String contains invalid character',
    // INV_ROLE: 'User can\'t take on the specified role',
    // INC_DATA: 'Incomplete request data',
    // INV_DATA: 'Invalid request data',
    // INV_LEN: 'Invalid array length',
    // NO_RECORD_CREATED: 'No record was created',
    // NO_RECORD_UPDATED: 'No record was updated',
    // NO_RECORD_DELETED: 'No record was deleted',
    // ZERO_RES: 'Database returned no result',
    467: {
        status_code: 403,
        code: 467,
        message: 'Invalid access token',
        type: 'Authentication',
        error_user_title: 'Authentication Error',
        error_user_msg: 'Unauthorized access'
    },
    code: {
        status_code: 400,
        code: 1,
        message: '',
        type: 'api_error',
        error_user_title: 'Error Title',
        error_user_msg: 'Error message'
    }
};
