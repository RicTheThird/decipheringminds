import React, { useEffect, useState } from "react";
import { Alert, Button, Card, CardContent, Checkbox, Grid, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import QuestionnaireForm from "./questionnaire-form";
import { Questionnaires } from "../constants/questionnaires";
import { getMyUserTest, getUserTest, postUserTest } from "../services/apiService";
import UserSearch from "./user-search";
import dayjs from "dayjs";
import { getUserProfile } from "../services/authService";

const Questionnaire: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedQuestionnaires, setSelectedQuestionnaires] = useState<string[]>([]);
  const [availableQuestionnaires, setAvailableQuestionnaires] = useState<any[]>([]);
  const [activeQuestionnaires, setActiveQuestionnaires] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<any>(null);


  const getSelectedUserInfo = (user: any) => {
    getSelectedUserTest(user.id);
    setSelectedPatient(user);
  }

  const removeSelectedUser = () => {
    setSelectedPatient(null);
    setAvailableQuestionnaires([])
    setActiveQuestionnaires([])
    setSelectedQuestionnaires([])
  }


  const profile = getUserProfile();

  const getSelectedUserTest = async (userId: number) => {
    const response = await getUserTest(userId)
    if (response && response.length) {
      const activeQuestions = response.filter(r => !r.isSubmitted)
      const avQuestions = Questionnaires.filter(q => !activeQuestions.some(r => r.testId == q.id));
      setAvailableQuestionnaires(avQuestions);
      setActiveQuestionnaires(activeQuestions)
    } else {
      setAvailableQuestionnaires(Questionnaires)
      setActiveQuestionnaires([])
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = Questionnaires.map((n) => n.id);
      setSelectedQuestionnaires(newSelecteds);
      return;
    }
    setSelectedQuestionnaires([]);
  };

  const onSelect = (event: any, qId: any) => {
    if (event.target.checked)
      setSelectedQuestionnaires((prevItems) => [...prevItems, qId]);
    else
      setSelectedQuestionnaires((prevItems) => prevItems.filter(item => item !== qId));
  };

  const sendQuestionnaires = async () => {
    const request: any[] = [];
    console.log(JSON.stringify(selectedQuestionnaires))
    selectedQuestionnaires.map((name) => {
      request.push(
        {
          testId: name,
          userId: selectedPatient.id
        }
      );
    });

    try {
      await postUserTest(request);
      setOpen(true)
      setAlert({ message: "Question successfully loaded to user.", success: true })
      removeSelectedUser();
    } catch (e) {
      console.log(e)
      setOpen(true)
      setAlert({ message: "An error occured. Please try again later.", success: false })
    }
  }

  return (
    <div>
      {profile?.role !== 'Admin' && <Typography variant="h6" gutterBottom color="error">
          You don't have access to this page
        </Typography>
      }
      {profile?.role === 'Admin' &&
        <div>
          <Typography variant="h4" gutterBottom>
            Questionnaire
          </Typography>
          <UserSearch setSelectedPatient={getSelectedUserInfo} />
          {selectedPatient && <>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500 }}
              paddingTop={2}
              textAlign="left"
              gutterBottom
            >
              Selected Patient
            </Typography>
            <Paper sx={{ padding: "10px" }}>
              <Typography variant="body1">Name: <strong>{`${selectedPatient?.firstName} ${selectedPatient?.lastName}`}</strong></Typography>
              <Typography variant="body1">Gender: <strong>{selectedPatient?.gender}</strong></Typography>
              <Typography variant="body1">Email: <strong>{selectedPatient?.email}</strong></Typography>


              <Button variant="contained" type="button" color="error"
                onClick={() => removeSelectedUser()}
                sx={{ marginTop: "20px" }}>
                Remove
              </Button>

              <Button variant="contained" type="button" color="primary"
                disabled={!selectedQuestionnaires || selectedQuestionnaires.length === 0}
                onClick={() => sendQuestionnaires()}
                sx={{ marginTop: "20px", marginLeft: "10px" }}>
                Send Questionnaires ({selectedQuestionnaires.length})
              </Button>

            </Paper>
          </>}


          <Typography variant="body1" paddingTop={5}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500 }}
              textAlign="left"
              gutterBottom
            >
              Select Available Questionnaires
            </Typography>
            <Grid spacing={3}>

              <Paper>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            //indeterminate={selected.length > 0 && selected.length < data.length}
                            checked={selectedQuestionnaires.length === Questionnaires.length}
                            onChange={handleSelectAllClick}
                          />
                        </TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>No. of questions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {availableQuestionnaires.map((row) => {
                        const isItemSelected = selectedQuestionnaires.indexOf(row.id) !== -1;
                        return (
                          <TableRow
                            hover
                            //onClick={(e) => onSelect(e, row.id)}
                            role="checkbox"
                            aria-checked={row.selected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                onChange={(e) => onSelect(e, row.id)}
                              />
                            </TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row.questions.length}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Typography>

          <Typography variant="body1" paddingTop={5}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500 }}
              textAlign="left"
              gutterBottom
            >
              Active Questionnaires
            </Typography>
            <Grid spacing={3}>

              <Paper>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Date Sent</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeQuestionnaires.map((row) => {
                        const q = Questionnaires.find(q => q.id == row.testId);
                        if (q) {
                          return (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={row.id}
                            >
                              <TableCell>{q?.title}</TableCell>
                              <TableCell>{dayjs(row?.createdAt).format("YYYY-MM-DD")}</TableCell>
                            </TableRow>
                          );
                        }
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Typography>

          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={() => setOpen(false)} severity={alert?.success ? "success" : "error"} sx={{ width: '100%' }}>
              {alert?.message}
            </Alert>
          </Snackbar>
        </div>
      }
    </div>

  );
};

export default Questionnaire;
