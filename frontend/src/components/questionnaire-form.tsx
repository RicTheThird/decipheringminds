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
    //console.log(JSON.stringify(answers));
    let request: any[] = []
    if (questionnairesItem?.id !== "DASS") {
      const sumScore = Object.values(answers).reduce((acc: any, curr) => acc + curr, 0) as number;
      const interpretation = questionnairesItem?.scoreRange?.find(q => q.start <= sumScore && q.end >= sumScore);
      console.log(questionnairesItem?.id + " = " + sumScore + " : " + interpretation?.value)
      request = [
        {
          testId: activeQuestion?.id,
          scoreType: questionnairesItem?.scoreDescription,
          score: sumScore,
          scoreInterpretation: interpretation?.value,
          isPublish: false,
        }
      ]
    } else {


      const stressScoreA = answers["0"] + answers["5"] + answers["7"] + answers["10"] + answers["11"] + answers["13"] + answers["17"];
      const stressScoreB = answers["21"] + answers["26"] + answers["28"] + answers["31"] + answers["32"] + answers["34"] + answers["38"];
      const stressTotalScore = (stressScoreA * 2) + stressScoreB;


      const anxietyScoreA = answers["1"] + answers["3"] + answers["6"] + answers["8"] + answers["14"] + answers["18"] + answers["19"];
      const anxietyScoreB = answers["22"] + answers["24"] + answers["27"] + answers["29"] + answers["35"] + answers["39"] + answers["40"];
      const anxietyTotalScore = (anxietyScoreA * 2) + anxietyScoreB;

      const depressionScoreA = answers["2"] + answers["4"] + answers["9"] + answers["12"] + answers["15"] + answers["16"] + answers["20"];
      const depressionScoreB = answers["23"] + answers["25"] + answers["30"] + answers["33"] + answers["36"] + answers["37"] + answers["41"];
      const depressionTotalScore = (depressionScoreA * 2) + depressionScoreB;

      const stressScoring = questionnairesItem?.scoreRanges?.find(s => s.type === 'Stress Severity');
      const anxietyScoring = questionnairesItem?.scoreRanges?.find(s => s.type === 'Anxiety Severity');
      const depressionScoring = questionnairesItem?.scoreRanges?.find(s => s.type === 'Depression Severity');

      request = [
        {
          testId: activeQuestion?.id,
          scoreType: stressScoring?.type,
          score: stressTotalScore,
          scoreInterpretation: stressScoring?.scoring.find(q => q.start <= stressTotalScore && q.end >= stressTotalScore)?.value,
          isPublish: false,
        },

        {
          testId: activeQuestion?.id,
          scoreType: anxietyScoring?.type,
          score: anxietyTotalScore,
          scoreInterpretation: anxietyScoring?.scoring.find(q => q.start <= anxietyTotalScore && q.end >= anxietyTotalScore)?.value,
          isPublish: false,
        },
        {
          testId: activeQuestion?.id,
          scoreType: depressionScoring?.type,
          score: depressionTotalScore,
          scoreInterpretation: depressionScoring?.scoring.find(q => q.start <= depressionTotalScore && q.end >= depressionTotalScore)?.value,
          isPublish: false,
        }
      ]
    }

    console.log(request)
    await postUserScores(activeQuestion?.id, request);
    getMyTestTaken()
    setActiveQuestion(null)
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
