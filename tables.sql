CREATE DATABASE waiters_app;
grant all privileges on database waiters_app to postgres;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100)
    password VARCHAR(50)
);

CREATE TABLE weekdays(
    id SERIAL PRIMARY KEY,
    weekdays VARCHAR(50)
);

INSERT INTO weekdays(weekdays) VALUES('Monday');
INSERT INTO weekdays(weekdays) VALUES('Tuesday');
INSERT INTO weekdays(weekdays) VALUES('Wednesday');
INSERT INTO weekdays(weekdays) VALUES('Thursday');
INSERT INTO weekdays(weekdays) VALUES('Friday');
INSERT INTO weekdays(weekdays) VALUES('Saturday');
INSERT INTO weekdays(weekdays) VALUES('Sunday');


CREATE TABLE shifts(
    id SERIAL PRIMARY KEY,
    user_id INT,
    weekdays_id INT,
    foreign key (user_id) references users(id) ON DELETE CASCADE,
    foreign key (weekdays_id) references weekdays(id) ON DELETE CASCADE
);

CREATE TABLE admin(
    id SERIAL PRIMARY KEY,
    adminName VARCHAR(55), 
    adminPassword VARCHAR(55)
);

INSERT INTO admin(adminName,adminPassword) VALUES('Fanie', 'Johnson28@admin');
