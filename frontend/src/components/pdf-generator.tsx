import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { Modal, Box, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  personalInfo: {
    marginBottom: 20,
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  content: {
    fontSize: 12,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 5,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    textAlign: 'center',
  },
  theader: {
    backgroundColor: '#f0f0f0',
  },
  cell: {
    margin: 'auto',
    fontSize: 10,
  },
});

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

// Create a PDF Document
const MyDocument = ({ data, assessmentReport }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* <Image src='/header-logo.png' style={{ width: 150, height: 100 }} /> Adjust size as needed */}

      <View style={styles.personalInfo}>
        <Text>Name: {data.name}</Text>
        <Text>Gender: {data.gender}</Text>
        <Text>Age: {dayjs().diff(dayjs(data.birthdate), 'year')}</Text>
        <Text>Email: {data.email}</Text>
        <Text>Appointment Date: {data.appointmentDate}</Text>
      </View>

      <Text style={styles.header}>{data.title}</Text>
      <View style={styles.section}>
        <Text style={styles.subheader}>Reason for referral</Text>
        <Text style={styles.content}>
          {data?.referralReason}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Intake Information</Text>
        <Text style={styles.content}>
          {data?.intakeInformation}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>General Observation</Text>
        <Text style={styles.content}>
          {data?.generalObservation}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Assessment Procedure and Results</Text>
        <Text style={styles.content}>
          {data?.assesmentProcedureResults}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Psychometric Profile</Text>
        <Text style={styles.content}>
          {data?.psychometricProfile}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Clinical Impression and Recommendation</Text>
        <Text style={styles.content}>
          {data?.clinicalImpressionRecommendation}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Assessment Result</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.theader]}>
            <View style={styles.tableCol}><Text style={styles.cell}>Test Name</Text></View>
            <View style={styles.tableCol}><Text style={styles.cell}>Raw Score</Text></View>
            <View style={styles.tableCol}><Text style={styles.cell}>Interpretation</Text></View>
            <View style={styles.tableCol}><Text style={styles.cell}>Date taken</Text></View>
          </View>

          {/* Data Rows */}
          {assessmentReport.map((a, rowIndex) => (
            <View style={styles.tableRow} key={rowIndex}>
              <View style={styles.tableCol}><Text style={styles.cell}>{a.title}</Text></View>
              <View style={styles.tableCol}><Text style={styles.cell}>{a.score}</Text></View>
              <View style={styles.tableCol}><Text style={styles.cell}>{a.interpretation}</Text></View>
              <View style={styles.tableCol}><Text style={styles.cell}>{a.submittedDate}</Text></View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

const PdfGenerator = ({ open, handleClose, data, assesmentReport }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          Print Preview
        </Typography>
        <PDFViewer style={{ width: '100%', height: '68vh' }}>
          <MyDocument data={data} assessmentReport={assesmentReport} />
        </PDFViewer>
        <Button onClick={handleClose} variant="contained" color="secondary">
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default PdfGenerator;
