SELECT * FROM `email-id-generation-db`.user_details;

INSERT INTO `email-id-generation-db`.user_details (first_name,last_name, email, is_admin) VALUES ("dinesh", "satharasi", "satharasidinesh@gmail.com", false)

UPDATE `email-id-generation-db`.`user_details`
SET
`password` = "asd"
WHERE id=8;