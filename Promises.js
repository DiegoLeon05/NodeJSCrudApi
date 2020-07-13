const doWorkpromise = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        // resolve([7,4,1])
        reject('Bad things');
        resolve([2,3,2])
    }, 2000)
})

doWorkpromise
    .then((result)=>{
        console.log('Success!', result);
    })
    .catch((error)=>{
        console.log('Error!', error);
    })