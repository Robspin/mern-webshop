import becrypt from 'bcryptjs';

const users = [
   {
      name: 'Admin User',
      email: 'admin@example.com',
      password: becrypt.hashSync('admin1234', 10),
      isAdmin: true
   },
   {
      name: 'Frank Hoofd',
      email: 'frank@example.com',
      password: becrypt.hashSync('frank1234', 10)
   },
   {
      name: 'Robin Robspin',
      email: 'Robin@example.com',
      password: becrypt.hashSync('robin1234', 10)
   }
];

export default users;
