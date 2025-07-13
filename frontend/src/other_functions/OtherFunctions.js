export const isObjectEmpty = (object)=>{
    // This function checks if provided object is empty or not.
    // if null, undefined is provided or empty object is provided so it returns false.
    // only true if :-
    if (object && Object.keys(object).length){
        return false;
    }
    return true;
}