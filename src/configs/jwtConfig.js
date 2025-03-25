
//this has to be a secret key that only the server knows and hide it like and shouldn't be hardcoded

const jwtSecretKey = process.env.jwtSecretKey;
const jwtAdminKey = process.env.jwtAdminKey;

module.exports = {
    jwtSecretKey,
    jwtAdminKey
};
