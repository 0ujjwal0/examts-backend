const cron = require("node-cron");
const Submission = require("../modal/submissionsmodal");
const Question = require("../modal/questionmodal");
const User = require("../modal/usermodal");
const path = require("path");
require("dotenv").config();

cron.schedule("* * * * *", async () => {
  console.log("Running Cron Job: Checking submissions and calculating marks");
  try {
    const submissions = await Submission.find({ isGraded: false });
    if (submissions.length === 0) {
      console.log("No ungraded submissions found.");
      return;
    }

    for (const submission of submissions) {
      let totalMarks = 0;
      for (const selection of submission.selections) {
        const question = await Question.findById(selection.questionId);
        if (question && question.correctOption === selection.option) {
          totalMarks += question.marks;
        }
      }

      submission.marks = totalMarks;
      submission.isGraded = true;
      await submission.save();
      console.log(
        `Graded submission ${submission._id} with marks: ${totalMarks}`
      );

      const user = await User.findById(submission.userId);
      if (!user) {
        console.log(`User not found for submission ${submission._id}`);
        continue;
      }
    }
    console.log("Submissions have been graded successfully");
  } catch (error) {
    console.error("Error grading submissions:", error);
  }
});
