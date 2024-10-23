
import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, FormControlLabel, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, withStyles } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UserSearch from './user-search';

import { useLocation, useNavigate } from 'react-router-dom';
import { getMyUserTest, getUserAppointment, getUserById, getUserTest, postUserScores, postUserTest, updateUserAppointmentStatus } from "../services/apiService";
import dayjs from 'dayjs';
import { Questionnaires } from '../constants/questionnaires';
import PsychReportModal from './psychreports-modal';
import PdfGenerator from './pdf-generator';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  height: '80vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const adminEmail = 'decipheringminds@gmail.com';
const adminName = 'Deciphering Minds';
const Patients: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const patientId = query.get('id');

  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [questionResults, setQuestionResults] = useState<any[]>([]);
  const [diagnosis, setDiagnosis] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [hideCancelled, setHideCancelled] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfModalData, setPdfModalData] = useState<any>(null);
  const [psychTestOpen, setPsychTestOpen] = useState(false);
  const [psychReportMode, setPsychReportMode] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<string[]>([]);
  const [assessmentReport, setAssessmentReport] = useState<string[]>([]);
  const handleOpen = () => setModalOpen(true);
  const handleClose = (userId) => {
    setModalOpen(false);
    if (userId)
      getAppointment(userId)
  }
  useEffect(() => {
    const fetchData = async () => {
      if (patientId && patientId !== '') {
        const user = await getUserById(Number(patientId));
        if (user)
          getSelectedUserInfo(user)
      }
    }
    fetchData();
  }, []);

  const getSelectedUserInfo = (user: any) => {
    setSelectedPatient(user);
    getSelectedUserTest(user.id)
    getAppointment(user.id)
  }

  const onSelect = (event: any, qId: any) => {
    if (event.target.checked)
      setSelectedAssessment((prevItems) => [...prevItems, qId]);
    else
      setSelectedAssessment((prevItems) => prevItems.filter(item => item !== qId));
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      if (questionResults.length > 0) {
        const newSelecteds = questionResults.map(n => n.userTestScores.map(s => s.id));
        setSelectedAssessment(newSelecteds);
      }
      return;
    }
    setSelectedAssessment([]);
  };

  const removeSelectedUser = () => {
    setSelectedPatient(null);
    setQuestionResults([])
    setAppointments([])
  }

  const getAppointment = async (userId: number) => {
    const response = await getUserAppointment(userId);
    if (response && response.length) {
      setAppointments(response)
      const d = response.filter(r => r.status === 'Completed')
        .map(r => ({ psychReports: r.psychReports.length > 0 ? r.psychReports[0] : [], appointmentDateTime: `${dayjs(r.bookedDate).format('YYYY-MM-DD')} ${r.startTime}:00-${r.endTime}:00` }));
      setDiagnosis(d);
    }
    else {
      setAppointments([])
      setDiagnosis([])
    }
  }

  const publishTestResult = async (testId: number, score: any) => {
    score.isPublished = true;
    await postUserScores(testId, [score]);
    await getSelectedUserTest(selectedPatient.id)
  }

  const updateAppointmentStatus = async (status: string, id: number) => {
    await updateUserAppointmentStatus(status, id);
    await getAppointment(selectedPatient.id)
  }

  const getAssessmentReport = () => {
    if (selectedAssessment.length > 0) {
      const temp: any[] = []
      questionResults.map(q => {
        q.userTestScores.map(u => {
          if (selectedAssessment.includes(u.id)) {
            temp.push({
              title: Questionnaires.find(qs => qs.id === q.testId)?.title,
              score: u.score,
              interpretation: u.scoreInterpretation,
              submittedDate: dayjs(q?.submittedAt).format('YYYY-MM-DD')
            })
          }
        })
      })
      setAssessmentReport(temp);
    } else {
      setAssessmentReport([]);
    }
  }

  const getSelectedUserTest = async (userId: number) => {
    const response = await getUserTest(userId)
    if (response && response.length) {

      const qWithResults = response.filter((r: { userTestScores: string | any[]; }) => r.userTestScores && r.userTestScores.length > 0);
      setQuestionResults(qWithResults);

      // const avQuestions = Questionnaires.filter(q => !response.some(r => r.testId == q.id));
      // setAvailableQuestionnaires(avQuestions);
      // setActiveQuestionnaires(response)
    } else {
      setQuestionResults([]);
    }
  };

  const setPdfData = (data: any) => {
    const result = data.psychReports[0] ?? null;
    const temp = {
      name: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      email: selectedPatient.email,
      gender: selectedPatient.gender,
      birthdate: selectedPatient.birthDate,
      appointmentDate: dayjs(data.bookedDate).format('YYYY-MM-DD'),
      title: "Psych Report",
      referralReason: result?.referralReason,
      assesmentProcedureResults: result?.assesmentProcedureResults,
      clinicalImpressionRecommendation: result?.clinicalImpressionRecommendation,
      generalObservation: result?.generalObservation,
      intakeInformation: result?.intakeInformation,
      psychometricProfile: result?.psychometricProfile,
      diagnosis: result?.diagnosis
    };
    setPdfModalData(temp);
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Patient Dashboard
      </Typography>

      <UserSearch setSelectedPatient={getSelectedUserInfo} selectedPatient={selectedPatient} />
      {selectedPatient &&
        <Box marginBottom={3}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 500 }}
            paddingTop={2}
            textAlign="left"
            gutterBottom
          >
            {`${selectedPatient?.firstName} ${selectedPatient?.lastName}`}
          </Typography>
          <Paper sx={{ padding: "10px" }}>
            {/* <Typography variant="body1">Name: <strong>{`${selectedPatient?.firstName} ${selectedPatient?.lastName}`}</strong></Typography> */}
            <Typography variant="body1">Gender: <strong>{selectedPatient?.gender.toUpperCase()}</strong></Typography>
            <Typography variant="body1">Email: <strong>{selectedPatient?.email}</strong></Typography>
            <Typography variant="body1">Birth Date: <strong>{dayjs(selectedPatient?.birthDate).format("YYYY-MM-DD")}</strong></Typography>
            <Button variant="contained" type="button" color="error"
              onClick={() => removeSelectedUser()}
              sx={{ marginTop: "20px" }}>
              Remove
            </Button>
          </Paper>
        </Box>}
      <div>
        <Accordion defaultExpanded sx={{ marginTop: "20px" }}>
          <AccordionSummary

            expandIcon={<ExpandMoreIcon />}
            aria-controls="appointments-content"
            id="appointments-header"
          >
            <Typography variant="h6">Appointments</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Checkbox
                  checked={hideCancelled}
                  onChange={(e) => setHideCancelled(e.target.checked)}
                  name="checkbox"
                  color="primary" // You can customize the color
                />
              }
              label="Hide Cancelled Appointments"
            />
            {appointments && appointments.length > 0 &&
              <TableContainer>
                <Table stickyHeader>
                  <TableHead >
                    <TableRow className='root'>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Topic</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.filter(a => (hideCancelled ? a.status !== 'Cancelled' : a.status !== '')).map((row) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.id}
                        >
                          <TableCell>{dayjs(row.bookedDate).format('YYYY-MM-DD')}</TableCell>
                          <TableCell>{`${row.startTime}:00 - ${row.endTime}:00`}</TableCell>
                          <TableCell>{row.bookedType}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell>{row?.bookedLocation}</TableCell>
                          <TableCell>
                            {
                              row.status === 'Confirmed' && <>
                                <Button variant="contained" type="button" color="warning" size='small' onClick={() => updateAppointmentStatus('Cancelled', row.id)}>
                                  Cancel
                                </Button>
                                <Button sx={{ marginLeft: "10px" }} variant="contained" size='small' type="button" color="primary"
                                  onClick={() => navigate(`/dashboard/meeting?userId=${selectedPatient?.id}&meetingNumber=${row?.meetingNumber}&meetingPassword=${row?.meetingPassword}&email=${adminEmail}&name=${adminName}&role=1`)}>
                                  Start Meeting
                                </Button>
                                <Button sx={{ marginLeft: "10px" }} variant="contained" size='small' type="button" color="success" onClick={() => updateAppointmentStatus('Completed', row.id)}>
                                  Completed
                                </Button>
                              </>
                            }
                            {
                              row.status === 'Completed' && row.psychReports.length === 0 && <>
                                <Button sx={{ marginLeft: "10px" }} variant="contained" size='small' type="button" color="secondary" onClick={() => {
                                  setSelectedAppointment(row);
                                  setPsychReportMode('new')
                                  setModalOpen(true);
                                }}>
                                  Create Psych Report
                                </Button>
                              </>
                            }
                            {
                              row.status === 'Completed' && row.psychReports.length > 0 && <>
                                <Button sx={{ marginLeft: "10px" }} variant="contained" size='small' type="button" color="secondary" onClick={() => {
                                  setSelectedAppointment(row);
                                  setPsychReportMode('edit')
                                  setModalOpen(true);
                                }}>
                                  View Psych Report
                                </Button>
                                <Button sx={{ marginLeft: "10px" }} variant="contained" size='small' type="button" color="primary" onClick={() => {
                                  setPdfData(row)
                                  setPsychTestOpen(true)
                                }}>
                                  Print Psych Report
                                </Button>
                              </>
                            }
                          </TableCell>
                        </TableRow>
                      );
                    }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            }
            {!appointments || appointments.length === 0 &&
              <Typography>
                No appointments found
              </Typography>
            }
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="psych-test-results-content"
            id="psych-test-results-header"
          >
            <Typography variant="h6">Psych Test Results</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {questionResults && questionResults.length > 0 &&
              <TableContainer>
                <Table stickyHeader>
                  <TableHead >
                    <TableRow className='root'>
                      <TableCell>Test Name</TableCell>
                      <TableCell>Raw Score</TableCell>
                      <TableCell>Interpretation</TableCell>
                      <TableCell>Submitted Date</TableCell>
                      <TableCell>Is Published</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {questionResults.map((row) =>
                      row.userTestScores.map((s: { id: React.Key | null | undefined; score: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; scoreInterpretation: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; isPublished: any; }) => {
                        return (
                          <TableRow
                            hover
                            aria-checked={row.selected}
                            tabIndex={-1}
                            key={s.id}
                          >
                            <TableCell>{Questionnaires.find(q => q.id === row.testId)?.title}</TableCell>
                            <TableCell>{s.score}</TableCell>
                            <TableCell>{s.scoreInterpretation}</TableCell>
                            <TableCell>{dayjs(row?.submittedAt).format('YYYY-MM-DD')}</TableCell>
                            <TableCell>{s.isPublished ? 'Yes' : 'No'}</TableCell>
                            <TableCell>{!s.isPublished &&
                              <Button fullWidth variant="contained" type="button" color="primary" onClick={() => publishTestResult(row.id, s)}>
                                Publish
                              </Button>}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            }
            {!questionResults || questionResults.length === 0 &&
              <Typography>
                No result found
              </Typography>
            }
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="diagnosis-content"
            id="diagnosis-header"
          >
            <Typography variant="h6">Diagnosis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {diagnosis && diagnosis.length > 0 &&
              <TableContainer>
                <Table stickyHeader>
                  <TableHead >
                    <TableRow className='root'>
                      <TableCell>Appointment Date & Time</TableCell>
                      <TableCell>Comment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {diagnosis.map((row, index) =>
                    (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={index}
                      >
                        <TableCell>{row.appointmentDateTime}</TableCell>
                        <TableCell>{row.psychReports?.diagnosis}</TableCell>
                      </TableRow>
                    )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            }
            {diagnosis.length === 0 && <Typography >
              No diagnosis found
            </Typography>}
          </AccordionDetails>
        </Accordion>
      </div>
      <PsychReportModal open={modalOpen} psychReportMode={psychReportMode} data={selectedAppointment} handleClose={handleClose} />

      <PdfGenerator open={pdfModalOpen}
        handleClose={() => setPdfModalOpen(false)}
        data={pdfModalData} assesmentReport={assessmentReport} />


      <Modal open={psychTestOpen} onClose={() => setPsychTestOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Select assesment result to include on the report.
          </Typography>
          <TableContainer>
            <Table stickyHeader>
              <TableHead >
                <TableRow className='root'>
                  <TableCell padding="checkbox">
                    {/* <Checkbox
                      color="primary"
                      //indeterminate={selected.length > 0 && selected.length < data.length}
                      checked={selectedAssessment.length === questionResults.length}
                      onChange={handleSelectAllClick}
                    /> */}
                  </TableCell>
                  <TableCell>Test Name</TableCell>
                  <TableCell>Raw Score</TableCell>
                  <TableCell>Interpretation</TableCell>
                  <TableCell>Submitted Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questionResults.map((row) =>
                  row.userTestScores.map((s) => {
                    const isItemSelected = selectedAssessment.indexOf(s.id) !== -1;
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={row.selected}
                        tabIndex={-1}
                        key={s.id}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onChange={(e) => onSelect(e, s.id)}
                          />
                        </TableCell>
                        <TableCell>{Questionnaires.find(q => q.id === row.testId)?.title}</TableCell>
                        <TableCell>{s.score}</TableCell>
                        <TableCell>{s.scoreInterpretation}</TableCell>
                        <TableCell>{dayjs(row?.submittedAt).format('YYYY-MM-DD')}</TableCell>

                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={() => { setPsychTestOpen(false); getAssessmentReport(); setPdfModalOpen(true) }} variant="contained" color="primary">
            Print
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Patients;
