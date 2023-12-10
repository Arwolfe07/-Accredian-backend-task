CREATE TABLE users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  username varchar(50) NOT NULL
) 