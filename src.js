function fetchData() {
    return new Promise((resolve, reject) => {
        // setTimeout(() => {
        //     console.log("fetching data");
            
        // }, 2300);

        const error = true;
        if (error) {
            reject("Error occured albeit known")
        } else {
            resolve("Data fetched")
        }
    })
}

function displayData(result) {
    resolve("Fetching Data");
    
}

//Using Promises
fetchData().then(result => {
    console.log(result);
    return displayData(result);
}) 
    .then(processedData => {
    console.log(processedData);
        
    })
    .catch((error) => {
    console.error("Error", error);          
    
})