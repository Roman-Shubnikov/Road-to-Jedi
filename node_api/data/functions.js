export const arrToString = (arr) => {
    let numeric_array = arr.map(parseInt)
    numeric_array = numeric_array.filter(v => !isNaN(v));
    return numeric_array.join(',');
}