// Basic idea of this asyncHandler is that we are creating a kind of middleware which will handle the async errors for us
// So, instead of writing try catch block in every async function, we can just wrap that function with this asyncHandler and it will handle the errors for us

const asyncHandler = (requesHandler) => {
    (req, res, next) =>{
        Promise.resolve(requesHandler(req, res, next)).catch((err)=>next(err));
    }
}

export {asyncHandler};

// __________________________________________________________

// The below is other way to wrting the same code as above, just without promises 



// const asyncHandler = () =>{}
//  here we are trying to create a higher order function which takes a function as an argument and returns a new function which handles the async errors
// const asyncHandler = (func) = {() => {}}
// here func is the function which we are passing as an argument to another function
// const asyncHandler = (func) => {async() => {}}
// now we are making the inner function as async function




// const asyncHandler = (fn) => async(req, res, next)=>{
//     try{
//         await fn(req, res, next);
//     }catch(err){
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message || "Internal Server Error"
//         })
//     }

// }