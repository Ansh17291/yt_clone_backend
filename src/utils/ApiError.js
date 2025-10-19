class ApiError extends Error {
    constructor(
        statusCode, 
        message = "Something went wrong",
        errors = [], 
        stack = "",
    ){
        super(message); // we call the parent class and set the message thing properly 
        // similar to calling it like :
        // const err = new Error(message);
        this.message = message;
        this.errors = errors;
        this.success = false;
        this.data = null;
        this.statusCode = statusCode;

        if(stack) {
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError}