SELECT * FROM `email-id-generation-db`.user_details;

INSERT INTO `email-id-generation-db`.user_details (first_name,last_name, email, is_admin) VALUES ("dinesh", "satharasi", "satharasidinesh@gmail.com", false)

UPDATE `email-id-generation-db`.`user_details`
SET
`password` = "asd"
WHERE id=8;

INSERT INTO `email-id-generation-db`.`customer_info`
(`id`,
`company_name`,
`lead_full_name`,
`lead_first_name`,
`lead_middle_name`,
`lead_last_name`,
`designation`,
`industry`,
`city`,
`country`,
`course`)
VALUES
(<{id: }>,
<{company_name: }>,
<{lead_first_name: }>,
<{lead_middle_name: }>,
<{lead_last_name: }>,
<{designation: }>,
<{industry: }>,
<{city: }>,
<{country: }>,
<{course: }>);

ALTER TABLE `email-id-generation-db`.`customer_info` 
ADD COLUMN `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `email_3`;



