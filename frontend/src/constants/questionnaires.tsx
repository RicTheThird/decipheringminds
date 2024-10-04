export const Questionnaires = [
  {
    id: "GAD7",
    title: "Generalized Anxiety Disorder Scale",
    subHeader: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    description: "Thank you for considering our anxiety assessment. It's a valuable tool to help understand your feelings and experiences. By taking this assessment, you're taking a proactive step towards self-awareness and potential support. Remember, your privacy is our priority, and your results will be kept confidential. Take your time, and if you have any questions or concerns, feel free to reach out to us. We're here to help.",
    scoreRange: [
      {
        start: 0,
        end: 4,
        value: "Minimal Anxiety"
      },
      {
        start: 5,
        end: 9,
        value: "Mild Anxiety"
      },
      {
        start: 10,
        end: 14,
        value: "Moderate Anxiety"
      },
      {
        start: 15,
        end: 21,
        value: "Severe Anxiety"
      }
    ],
    scoreDescription: "Anxiety Severity",
    scales: [
      {
        rate: 0,
        description: "Not at all",
      },
      {
        rate: 1,
        description: "Several Days",
      },
      {
        rate: 2,
        description: "More than half the days",
      },
      {
        rate: 3,
        description: "Nearly everyday",
      },
    ],
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid, as if something awful might happen",
    ],
    selected: false,
    additionalQuestions: [],
  },
  {
    id: "PHQ9",
    title: "Patient Health Questionnaire",
    subHeader: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    description:  "Thank you for considering our depression assessment. Your privacy is important, and your results will remain confidential. If you have any questions, we're here to help",
    scoreRange: [
      {
        start: 0,
        end: 4,
        value: "Minimal Depression"
      },
      {
        start: 5,
        end: 9,
        value: "Mild Depression"
      },
      {
        start: 10,
        end: 14,
        value: "Moderate Depression"
      },
      {
        start: 15,
        end: 19,
        value: "Moderate Severe Depression"
      },
      {
        start: 20,
        end: 27,
        value: "Severe Depression"
      }
    ],
    scoreDescription: "Depression Severity",
    scales: [
      {
        rate: 0,
        description: "Not at all",
      },
      {
        rate: 1,
        description: "Several Days",
      },
      {
        rate: 2,
        description: "More than half the days",
      },
      {
        rate: 3,
        description: "Nearly everyday",
      },
    ],    
    selected: false,
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
      "Trouble concentrating on things, such as reading the newspaper or watching television",
      "Moving or speaking so slowly that other people could have noticed. Or the opposite being so figety or restless that you have been moving around a lot more than usual",
      "Thoughts that you would be better off dead, or of hurting yourself",
    ],
    additionalQuestions: [
      {
        question:
          "If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
        answers: [
          {
            rate: 0,
            description: "Not difficult at all",
          },
          {
            rate: 1,
            description: "Somewhat difficult",
          },
          {
            rate: 2,
            description: "Very difficult",
          },
          {
            rate: 3,
            description: "Extremely difficult",
          },
        ],
      },
    ],
  },
  {
    id: "DASS",
    title: "Depression, Anxiety and Stress Scale",
    subHeader: "Read each statement and select which indicates how much the statement applied to you over the past week. There are no right or wrong answers. Do not spend too much time on any statement.",
    description: "Thank you for considering our Depression, Anxiety, and Stress Scales assessment. Your privacy is important, and your results will remain confidential. If you have any questions, we're here to help",
    selected: false,
    scales: [
      {
        rate: 0,
        description: "Did not apply at all",
      },
      {
        rate: 1,
        description: "Applied to me to some degree, or some of the time",
      },
      {
        rate: 2,
        description:
          "Applied to me to a considerable degree, or a good part of time",
      },
      {
        rate: 3,
        description: "Applied to me very much, or most of the time",
      },
    ],
    questions: [
      "I found myself getting upset by quite trivial things",
      "I was aware of dryness of my mouth",
      "I couldn't seem to experience any positive feeling at all",
      "l experienced breathing difficulty (eg, excessively rapid breathing breathlessness in the absence of physical exertion)",
      "I just couldn't seem to get going",
      "I tended to over-react to situations",
      "I had a feeling of shakiness (eg, legs going to give way)",
      "I found it difficult to relax",
      "I found myself in situations that made me so anxious I was most relieved when they ended",
      "I felt that | had nothing to look forward to",
      "I found myself getting upset rather easily",
      "I felt that I was using a lot of nervous energy",
      "I felt sad and depressed",
      "I found myself getting impatient when I was delayed in any way (e.g. lifts, traffic lights, being kept waiting)",
      "I had a feeling of faintness",
      "I felt that | had lost interest in just about everything",
      "I felt | wasn't worth much as a person",
      "I felt that I was rather touchy",
      "I perspired noticeably (eg. hands sweaty) in the absence of high temperatures or physical extinction",
      "I felt scared without any good reason",
      "I felt that life wasn't worthwhile",
      "I found it hard to wind down",
      "I had difficulty in swallowing",
      "I couldn't seem to get any enjoyment out of the things I did",
      "I was aware of the action of my heart in the absence of physical exertion (eg. sense of heart rate increase, heart missing a beat",
      "I felt down-hearted and blue",
      "I found that | was very irritable",
      "I felt I was close to panic",
      "I found it hard to calm down after something upset me",
      "I fear that I would be thrown by some trivial but unfamiliar task",
      "I was unable to become enthusiastic about anything",
      "I found it difficult to tolerate interruptions to what I was doing",
      "I was in a state of nervous tension",
      "I felt | was pretty worthless",
      "I was intolerant of anything that kept me from getting on with what I was doing",
      "I felt terrified",
      "I could see nothing in the future to be hopeful about",
      "I felt that life was meaningless",
      "I found myself getting agitated",
      "I was worried about situations in which I might panic and make a fool of myself",
      "I experienced trembling (eg, in the hands)",
      "I found it difficult to work up the initiative to do things",
    ],
  },
  {
    id: "PSS",
    title: "Perceived Stress Scale",
    selected: false,
    scoreRange: [
      {
        start: 0,
        end: 13,
        value: "Low Stress"
      },
      {
        start: 14,
        end: 26,
        value: "Moderate Stress"
      },
      {
        start: 27,
        end: 40,
        value: "High Stress"
      }
    ],
    scoreDescription: "Stress Severity",
    scales: [
      {
        rate: 0,
        description: "Never",
      },
      {
        rate: 1,
        description: "Almost Never",
      },
      {
        rate: 2,
        description: "Sometimes",
      },
      {
        rate: 3,
        description: "Fairly Often",
      },

      {
        rate: 4,
        description: "Very Often",
      },
    ],
    questions: [
      "In the last month, how often have you been upset because of something that happened unexpectedly?",
      "In the last month, how often have you felt that you were unable to control the important things in your life?",
      "In the last month, how often have you felt nervous and stressed?",
      "In the last month, how often have you felt confident about your ability to handle your personal problems?",
      "In the last month, how often have you felt that things were going your way?",
      "In the last month, how often have you found that you could not cope with all the things that you had to do?",
      "In the last month, how often have you been able to control irritations in your life?",
      "In the last month, how often have you felt that you were on top of things?",
      "In the last month, how often have you been angered because of things that happened that were outside of your control?",
      "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
    ],
  },
  {
    id: "PSWQ",
    title: "The Penn State Worry Questionnaire",
    selected: false,
    scoreRange: [
      {
        start: 0,
        end: 29,
        value: "Not anxious or a worrier"
      },
      {
        start: 30,
        end: 52,
        value: "Bothered by worries but below clinical range for worry"
      },
      {
        start: 53,
        end: 65,
        value: "Currently have some problems with worry and may benefit from treatment"
      },
      {
        start: 66,
        end: 80,
        value: "Chronic worrier and in need of treatment to target this problem"
      }
    ],
    scoreDescription: "Levels of Trait Worry",
    scales: [
      {
        rate: 1,
        description: "Not at all typical of me",
      },
      {
        rate: 2,
        description: "Rarely typical of me",
      },
      {
        rate: 3,
        description: "Somewhat typical of me",
      },
      {
        rate: 4,
        description: "Often typical of me",
      },
      {
        rate: 5,
        description: "Very typical of me",
      },
    ],
    questions: [
      "If I do not have enough time to do everything, I do not worry about it.",
      "My worries overwhelm me.",
      "I do not tend to worry about things.",
      "Many situations make me worry.",
      "I know I should not worry about things, but I just cannot help it.",
      "When I am under pressure I worry a lot.",
      "I am always worrying about something.",
      "I find it easy to dismiss worrisome thoughts.",
      "As soon as I finish one task, I start to worry about everything else I have to do.",
      "I never worry about anything.",
      "When there is nothing more I can do about a concern, I do not worry about it any more.",
      "I have been a worrier all my life.",
      "I notice that I have been worrying about things.",
      "Once I start worrying, I cannot stop.",
      "I worry all the time.",
      "I worry about projects until they are all done.",
    ],
  },
  {
    id: "HRSA",
    title: "Hamilton Rating Scale for Anxiety",
    selected: false,
    scoreRange: [
      {
        start: 0,
        end: 17,
        value: "Minimal Anxiety"
      },
      {
        start: 18,
        end: 24,
        value: "Mild Anxiety"
      },
      {
        start: 25,
        end: 30,
        value: "Moderate Anxiety"
      },
      {
        start: 31,
        end: 56,
        value: "Severe Anxiety"
      }
    ],
    scoreDescription: "Anxiety Severity",
    scales: [
      {
        rate: 0,
        description: "None",
      },
      {
        rate: 1,
        description: "Mild",
      },
      {
        rate: 2,
        description: "Moderate",
      },
      {
        rate: 3,
        description: "Severe",
      },
      {
        rate: 4,
        description: "Severe, Grossly Disabling",
      },
    ],
    questions: [
      "Anxious - Worries, anticipation of the worst, fearful anticipation, irritability",
      "Tension - Feelings of tension, fatigability, startle response, moved to tears easily, trembling, feelings of restlessness, inability to relax",
      "Fears - Of dark, of strangers, of being left alone, of animals, of traffic, of crowds",
      "Insomnia - Difficulty in falling asleep, broken sleep, unsatisfying sleep and fatigue on waking, dreams, nightmares, night-terrors",
      "Intellectual Cognitive - Difficulty in concentration, poor memory",
      "Depressed Mood - Loss of interest, lack of pleasure in hobbies, depression, early waking, diurnal swing",
      "Somatic (muscular) - Pains and aches, twitching, stiffness, myoclonic jerks, grinding of teeth, unsteady voice, increased muscular tone",
      "Somatic (sensory) - Tinnitus, blurring of vision, hot and cold flushes, feelings of weakness, pricking sensation",
      "Cardiovascular Symptoms - Tachycardia, palpitations, pain in chest, throbbing of vessels, fainting feelings, missing beat",
      "Respiratory Symptoms -  Pressure or constriction in chest, choking feelings, sighing, dyspnea",
      "Gastrointestinal Symptoms - Difficulty in swallowing, wind, abdominal pain, burning sensations,abdominal fullness, nausea, vomiting, borborygmi, looseness of bowels, loss of weight, constipation",
      "Genitourinary Symptoms - Frequency of micturition, urgency of micturition, amenorrhea, menorrhagia, development of frigidity, premature ejaculation, loss of libido, impotence",
      "Autonomic Symptoms - Dry mouth, flushing, pallor, tendency to sweat, giddiness, tension headache, raising of hair",
      "Behavior at Interview - Fidgeting, restlessness or pacing, tremor of hands, furrowed brow, strained face, sighing or rapid respiration, facial pallor, swallowing, belching, brisk tendon jerks, dilated pupils, exophthalmos",
    ],
  },
];
