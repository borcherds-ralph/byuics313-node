var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize(process.env.DATABASE_URL);

// setup User model and its fields.
var User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        required: 'Please enter a user name'
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        required: 'E-mail is required'
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        required: 'a password is required'
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
        required: 'Your City is require'
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false,
        required: 'Your State is Required'
    },
    zipcode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        required: 'Your zipcode is required for customized location info'
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    userType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'User'
    }
}, {
    hooks: {
        beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        }
    }
});

User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;