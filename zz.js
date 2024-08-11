const bcryptjs = require('bcryptjs')
const saltRounds = 10;

myPlaintextPassword = "narasimha";

let a;




const hash = bcryptjs.hashSync(myPlaintextPassword, saltRounds);

bcryptjs.compareSync(myPlaintextPassword, hash);
console.log(bcryptjs.compareSync(myPlaintextPassword, hash))
