CREATE TABLE `users` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	`phone` VARCHAR(255),
	`cv` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `hrs` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `exam_types` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`type` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `questions` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`exam_type_id` INT NOT NULL,
	`body` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `answers` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`question_id` INT NOT NULL,
	`body` VARCHAR(255) NOT NULL,
	`is_correct` BOOLEAN NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `positions` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(255) NOT NULL,
	`details` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `applications` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`position_id` INT NOT NULL,
	`user_id` INT NOT NULL,
	`status` INT NOT NULL DEFAULT '0',
	`exams_deadline` DATETIME,
	`isExamsOrdered BOOLEAN NOT NULL default 0`
	PRIMARY KEY (`id`)
);

CREATE TABLE `application_exams` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`application_id` INT NOT NULL,
	`exam_type_id` INT NOT NULL,
	`order` INT,
	`score` INT NOT NULL DEFAULT '0',
	`session_id` VARCHAR(255);,
	`number_of_skipped_questions` INT NOT NULL DEFAULT '0',
	`number_of_solved_questions` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`)
);

CREATE TABLE `application_exam_questions` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`application_exam_id` INT NOT NULL,
	`question_id` INT NOT NULL,
	`correct_answer_id` INT,
	`user_answer_id` INT,
	`status` INT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `application_exam_question_answers` (
	`application_exam_question_id` INT NOT NULL,
	`answer_id` INT NOT NULL
);

ALTER TABLE `questions` ADD CONSTRAINT `questions_fk0` FOREIGN KEY (`exam_type_id`) REFERENCES `exam_types`(`id`);

ALTER TABLE `answers` ADD CONSTRAINT `answers_fk0` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`);

ALTER TABLE `applications` ADD CONSTRAINT `applications_fk0` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`);

ALTER TABLE `applications` ADD CONSTRAINT `applications_fk1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);

ALTER TABLE `application_exams` ADD CONSTRAINT `application_exams_fk0` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`);

ALTER TABLE `application_exams` ADD CONSTRAINT `application_exams_fk1` FOREIGN KEY (`exam_type_id`) REFERENCES `exam_types`(`id`);

ALTER TABLE `application_exam_questions` ADD CONSTRAINT `application_exam_questions_fk0` FOREIGN KEY (`application_exam_id`) REFERENCES `application_exams`(`id`);

ALTER TABLE `application_exam_questions` ADD CONSTRAINT `application_exam_questions_fk1` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`);

ALTER TABLE `application_exam_questions` ADD CONSTRAINT `application_exam_questions_fk2` FOREIGN KEY (`correct_answer_id`) REFERENCES `answers`(`id`);

ALTER TABLE `application_exam_questions` ADD CONSTRAINT `application_exam_questions_fk3` FOREIGN KEY (`user_answer_id`) REFERENCES `answers`(`id`);

ALTER TABLE `application_exam_question_answers` ADD CONSTRAINT `application_exam_question_answers_fk0` FOREIGN KEY (`application_exam_question_id`) REFERENCES `application_exam_questions`(`id`);

ALTER TABLE `application_exam_question_answers` ADD CONSTRAINT `application_exam_question_answers_fk1` FOREIGN KEY (`answer_id`) REFERENCES `answers`(`id`);


ALTER TABLE `questions` ADD CONSTRAINT `questions_fk0` FOREIGN KEY (`exam_type_id`) REFERENCES `exam_types`(`id`) ON DELETE CASCADE;

ALTER TABLE `answers` ADD CONSTRAINT `answers_fk0` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE;

ALTER TABLE `applications` ADD CONSTRAINT `applications_fk0` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON DELETE CASCADE;

ALTER TABLE `applications` ADD CONSTRAINT `applications_fk1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;

ALTER TABLE `application_exams` ADD CONSTRAINT `application_exams_fk0` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE;

ALTER TABLE `application_exams` ADD CONSTRAINT `application_exams_fk1` FOREIGN KEY (`exam_type_id`) REFERENCES `exam_types`(`id`) ON DELETE CASCADE;

ALTER TABLE `application_exam_questions` ADD CONSTRAINT `application_exam_questions_fk0` FOREIGN KEY (`application_exam_id`) REFERENCES `application_exams`(`id`) ON DELETE CASCADE;

ALTER TABLE `application_exam_questions` ADD CONSTRAINT `application_exam_questions_fk1` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE;

ALTER TABLE `application_exam_questions` ADD CONSTRAINT `application_exam_questions_fk2` FOREIGN KEY (`correct_answer_id`) REFERENCES `answers`(`id`) ON DELETE CASCADE;

ALTER TABLE `application_exam_questions` ADD CONSTRAINT `application_exam_questions_fk3` FOREIGN KEY (`user_answer_id`) REFERENCES `answers`(`id`) ON DELETE CASCADE;

ALTER TABLE `application_exam_question_answers` ADD CONSTRAINT `application_exam_question_answers_fk0` FOREIGN KEY (`application_exam_question_id`) REFERENCES `application_exam_questions`(`id`) ON DELETE CASCADE;

ALTER TABLE `application_exam_question_answers` ADD CONSTRAINT `application_exam_question_answers_fk1` FOREIGN KEY (`answer_id`) REFERENCES `answers`(`id`) ON DELETE CASCADE;

