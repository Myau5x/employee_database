USE employeeDB;

INSERT INTO departments (id, name)
VALUES (1,"IT");

INSERT INTO departments (id, name)
VALUES (2,"Sales");

INSERT INTO roles (id, title,salary, department_id)
VALUES (1,"Support",50000.00, 1);

INSERT INTO roles (id, title,salary, department_id)
VALUES (2,"IT Director",250000.00, 1);

INSERT INTO roles (id, title,salary, department_id)
VALUES (2,"Salesman",50000.00, 2);

INSERT INTO employees ( first_name,last_name, role_id)
VALUES ('Olga','Illarionova',2);

