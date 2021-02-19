function User(email, password) {       // Accept name and age in the constructor
  this.email = email || null;
  this.password  = password  || null;
}

module.exports = User;  