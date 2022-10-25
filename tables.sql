CREATE DATABASE waiters_app;
grant all privileges on database waiters_app to postgres;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100)
);

CREATE TABLE weekdays(
    id SERIAL PRIMARY KEY,
    weekdays VARCHAR(50)
);

INSERT INTO weekdays(weekdays) VALUES('monday');
INSERT INTO weekdays(weekdays) VALUES('Tuesday');
INSERT INTO weekdays(weekdays) VALUES('wednesday');
INSERT INTO weekdays(weekdays) VALUES('thursday');
INSERT INTO weekdays(weekdays) VALUES('friday');
INSERT INTO weekdays(weekdays) VALUES('saturday');
INSERT INTO weekdays(weekdays) VALUES('sunday');


CREATE TABLE shifts(
    id SERIAL PRIMARY KEY,
    user_id INT,
    weekdays_id INT,
    foreign key (user_id) references users(id),
    foreign key (weekdays_id) references weekdays(id)
);