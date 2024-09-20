import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Questionnaires } from "../constants/questionnaires";
import { postUserScores, postUserTest } from "../services/apiService";

interface ChildProps {
  activeQuestion: any;
  setActiveQuestion: (question: any) => void;
  getMyTestTaken: () => void;
}

const QuestionnaireForm: React.FC<ChildProps> = ({
  activeQuestion,
  setActiveQuestion,
  getMyTestTaken
}) => {

  const [answers, setAnswers] = useState({});
  const questionnairesItem = Questionnaires.find((f) => f.id === activeQuestion.testId);
  // Handle change event for radio buttons
  const handleAnswerChange = (questionIndex: number, rate: number) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: rate,
    }));

    console.log(answers)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(JSON.stringify(answers));
    if (questionnairesItem?.id !== "DASS") {
      const sumScore = Object.values(answers).reduce((acc: any, curr) => acc + curr, 0) as number;
      const interpretation = questionnairesItem?.scoreRange?.find(q => q.start <= sumScore && q.end >= sumScore);
      console.log(questionnairesItem?.id + " = " + sumScore + " : " + interpretation?.value)
      const request = [
        {
          testId: activeQuestion?.id,
          scoreType: questionnairesItem?.scoreDescription,
          score: sumScore,
          scoreInterpretation: interpretation?.value,
          isPublish: false,
        }
      ]
      await postUserScores(activeQuestion?.id, request);
      getMyTestTaken()
      setActiveQuestion(null)
    }
  };


  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        {questionnairesItem?.title}
      </Typography>
      <Typography gutterBottom>
        {questionnairesItem?.subHeader}
      </Typography>
      <Box mt={4}>
        <form onSubmit={handleSubmit}>
          {questionnairesItem?.questions.map((item, index) => (
            <Card key={index} sx={{ marginBottom: "20px" }}>
              <CardContent>
                <FormControl
                  key={index}
                  component="fieldset"
                  margin="normal"
                  fullWidth
                >
                  <Typography variant="h6" gutterBottom>
                    {item}
                  </Typography>
                  <RadioGroup
                    row
                    value={answers[index] === undefined ? '' : answers[index] === 0 ? 0 : answers[index]}
                    onChange={(e) => handleAnswerChange(index, Number(e.target.value))}
                  >
                    {questionnairesItem?.scales.map((scale, index) => (
                      <FormControlLabel
                        required
                        key={index}
                        value={scale.rate}
                        control={<Radio />}
                        label={scale.description}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          ))}

          <Box mt={3}>
            <Button
              sx={{ marginRight: "10px" }}
              type="button"
              variant="contained"
              color="warning"
              onClick={() => setActiveQuestion(null)}
            >
              Back
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default QuestionnaireForm;
