const bcrypt = require('bcryptjs');
const { db } = require('../config/db'); // Assuming your knex instance is in the config/db file

// Function to create an admin user
const createAdminUser = async () => {
  try {
    // Hash the admin password
    const hashedPassword = await bcrypt.hash('Sheerpeace.196500', 10); // Replace 'adminpassword' with the desired password

    // Insert the admin user into the 'users' table
    const [newAdminUser] = await db('users').insert({
      name: 'Admin', // Admin user name
      email: 'admin@sheerpeace.store', // Admin email (change as needed)
      password: hashedPassword, // Hashed password
      user_type: 'admin', // Set user type as 'admin'
    }).returning('*'); // Return the inserted user for confirmation

    console.log('Admin user created successfully:', newAdminUser);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
};

// Run the function to add the admin user
createAdminUser();
