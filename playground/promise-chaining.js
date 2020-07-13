require("../src/db/mongoose");
const User = require("../src/models/user");

// User.findByIdAndUpdate('5f03a8a265e95f2eacf440b8', {UserAge: 30})
// .then((user)=>{
//     console.log(user);
//     return User.countDocuments({ age :30});
// })
// .then((result)=>{
//     console.log(result);
// })
// .catch((error)=>{
//     console.log(error);
// })
const UpdateAgeAndCount = async (id, UserAge) =>{
    const user = await User.findByIdAndUpdate(id, { UserAge });
    const count = await User.countDocuments({ UserAge });
    return count;
};

UpdateAgeAndCount('5f03a8a265e95f2eacf440b8', 5)
    .then((count) => {
        console.log(count);
    })
    .catch((error) => {
        console.log(error);
    });