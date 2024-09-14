import React, { useState } from "react";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import QuestionnaireForm from "./questionnaire-form";
import { Questionnaires } from "../constants/questionnaires";

const Questionnaire: React.FC = () => {

  const [activeQuestion, setActiveQuestion] = useState("");

  return (
    <div>
      { !activeQuestion && (
        <>
          <Typography variant="h4" gutterBottom>
            Questionnaire
          </Typography>

          <Typography variant="body1" paddingTop={5}>
            <Grid container spacing={3}>
              {Questionnaires.map((item, index) => (
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
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "white" }}
                        textAlign="left"
                      >
                        {item.description}
                      </Typography>
                        <Button
                          sx={{
                            marginTop: "15px",
                            borderRadius: "20px",
                            color: "black",
                            fontWeight: "600",
                          }}
                          onClick={() => setActiveQuestion(item.id) }
                        >
                          Proceed
                        </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Typography>
        </>
      )}
      {
        activeQuestion && <QuestionnaireForm qformId={activeQuestion} setActiveQuestion={setActiveQuestion} />
      }
    </div>
  );
};

export default Questionnaire;
