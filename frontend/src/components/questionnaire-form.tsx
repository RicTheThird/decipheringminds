import React from "react";
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

interface ChildProps {
  qformId: string;
  setActiveQuestion: (qformId: string) => void;
}

const QuestionnaireForm: React.FC<ChildProps> = ({
  qformId,
  setActiveQuestion,
}) => {
  //const { qformId } = useParams<{ qformId: string }>();

  const questionnairesItem = Questionnaires.find((f) => f.id === qformId);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        {questionnairesItem?.title}
      </Typography>
      <Typography gutterBottom>
        {questionnairesItem?.subHeader}
      </Typography>
      <Box mt={4}>
        {questionnairesItem?.questions.map((item, index) => (
          <Card sx={{ marginBottom: "20px" }}>
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
                  // value={answers[item.id] ?? ''}
                  // onChange={(e) => handleAnswerChange(item.id, parseInt(e.target.value))}
                >
                  {questionnairesItem?.scales.map((scale, index) => (
                    <FormControlLabel
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
            type="submit"
            variant="contained"
            color="warning"
            onClick={() => setActiveQuestion("")}
          >
            Back
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default QuestionnaireForm;
