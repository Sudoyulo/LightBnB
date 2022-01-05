

INSERT INTO users (name, email, password) VALUES ('Andy Handyman', 'handy@andy.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password)
VALUES ('Busy Betty', 'busy@betty.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password)
VALUES ('Crazy Carol', 'crazy@carol.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'A spot', 'description', 'url', 'url', 10, 1, 1, 2, 'Canada', 'A Street', 'Vancouver', 'BC', 'A1A1A1', TRUE);
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (2, 'B spot', 'description', 'url', 'url', 11, 2, 2, 3, 'America', 'B Street', 'NY', 'NY', '11122', TRUE);
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (3, 'C spot', 'description', 'url', 'url', 5, 2, 3, 1, 'Japan', 'C Ave', 'Sapporo', 'HKD', '0740005', FALSE);


INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26');
INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (2, 2, '2019-01-04', '2019-02-01');
INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 4, 'message');
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 3, 2, 10, 'message');
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (3, 1, 3, 0, 'message');