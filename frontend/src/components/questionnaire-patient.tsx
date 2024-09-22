import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import QuestionnaireForm from "./questionnaire-form";
import { Questionnaires } from "../constants/questionnaires";
import { getMyUserTest } from "../services/apiService";
import UserSearch from "./user-search";

const QuestionnairePatient: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [assignedQuestions, setAssignedQuestions] = useState<any[]>([]);
  useEffect(() => {
    getMyTestTaken();
  }, []);

  const getMyTestTaken = async () => {
    const response = await getMyUserTest()
    if (response && response.length) {
      setAssignedQuestions(response);
    } else {
      setAssignedQuestions([])
    }
    console.log(response)
  };

  return (
    <div>
      {!activeQuestion && (
        <>
          <Typography variant="h4" gutterBottom>
            Questionnaires
          </Typography>

          <Typography variant="body1" paddingTop={5}>
            {/* <Typography
              variant="h5"
              sx={{ fontWeight: 600 }}
              textAlign="left"
              gutterBottom
            >
            </Typography> */}

            {!assignedQuestions || assignedQuestions.length === 0 &&
              <Typography variant="body1">No loaded questionnaires</Typography>
            }
            <Grid container spacing={3}>
              {assignedQuestions.map((item, index) => {
                const qDetails = Questionnaires.find(q => q.id == item.testId)
                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        background:
                          "linear-gradient(180deg, #4BD2D7 26.59%, #0F85A5 54.35%)",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 600, color: "white" }}
                          textAlign="left"
                          gutterBottom
                        >
                          {qDetails?.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "white" }}
                          textAlign="left"
                        >
                          {qDetails?.description}
                        </Typography>
                        {!item.isSubmitted &&
                          <Button
                            sx={{
                              marginTop: "15px",
                              borderRadius: "20px",
                              color: "black",
                              fontWeight: "600",
                            }}
                            onClick={() => setActiveQuestion(item)}
                          >
                            Proceed
                          </Button>
                        }
                        {item.isSubmitted &&
                          <Typography variant="h6" sx={{ marginTop: "10px" }}>
                            Submitted
                          </Typography>
                        }
                      </CardContent>
                    </Card>
                  </Grid>)
              })}
            </Grid>
          </Typography>
        </>
      )}
      {
        activeQuestion && <QuestionnaireForm activeQuestion={activeQuestion} setActiveQuestion={setActiveQuestion} getMyTestTaken={getMyTestTaken} />
      }
    </div>
  );
};

export default QuestionnairePatient;
