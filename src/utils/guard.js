export function exhaustiveGuard(_value){
    throw new Error(`Error ! Reached forbidden guard with unexpected value: ${JSON.stringify(_value)}`)
}