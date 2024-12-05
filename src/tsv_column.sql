-- Question
CREATE or REPLACE FUNCTION populate_tsv_column_for_question()
RETURNS TRIGGER
AS
$$
BEGIN
 UPDATE question SET tsv_column = to_tsvector('english', title || ' ' || description);
 RETURN NEW;
END
$$
LANGUAGE plpgsql;



CREATE TRIGGER udpate_tsv_column AFTER INSERT OR UPDATE ON question
FOR EACH ROW
EXECUTE PROCEDURE populate_tsv_column_for_question();


-- Answer
CREATE or REPLACE FUNCTION populate_tsv_column_for_answer()
RETURNS TRIGGER
AS
$$
BEGIN
 UPDATE answer SET tsv_column = to_tsvector('english',description);
 RETURN NEW;
END
$$
LANGUAGE plpgsql;



CREATE TRIGGER udpate_tsv_column AFTER INSERT OR UPDATE ON answer
FOR EACH ROW
EXECUTE PROCEDURE populate_tsv_column_for_answer();
