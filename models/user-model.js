function User(email, password) {       // Accept name and age in the constructor
  this.email = email || null;
  this.password  = password  || null;
  this.active = false; 
}

module.exports = User;  