const fs = require("fs");
const ResumeModel = require("../Models/resume");
const pdfParse = require("pdf-parse");
const { CohereClient } = require("cohere-ai");

const cohereApiKey = process.env.COHERE_API_KEY;
const cohereModel = process.env.COHERE_MODEL || "command-r";
const cohere = cohereApiKey ? new CohereClient({ token: cohereApiKey }) : null;

const parseScoreAndReason = (text = "") => {
  const scoreMatch = text.match(/score\s*[:\-]?\s*(\d{1,3})/i);
  const reasonMatch = text.match(/reason\s*[:\-]?\s*([\s\S]*)/i);

  const rawScore = scoreMatch ? Number(scoreMatch[1]) : 0;
  const score = Number.isNaN(rawScore) ? 0 : Math.max(0, Math.min(100, rawScore));
  const reason = (reasonMatch?.[1] || text || "No feedback generated").trim();

  return { score: String(score), feedback: reason };
};

const fallbackAnalysis = (resumeText = "", jobDesc = "") => {
  const tokenize = (txt) =>
    txt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);

  const resumeSet = new Set(tokenize(resumeText));
  const jdSet = new Set(tokenize(jobDesc));
  const overlap = [...jdSet].filter((w) => resumeSet.has(w));
  const score = jdSet.size ? Math.round((overlap.length / jdSet.size) * 100) : 0;

  return {
    score: String(Math.max(0, Math.min(100, score))),
    feedback: overlap.length
      ? `Matched keywords: ${overlap.slice(0, 12).join(", ")}`
      : "Low keyword match. Add more JD-specific skills and project evidence.",
  };
};

exports.addResume = async (req, res) => {
  let pdfPath;
  try {
    const { job_desc, user } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }
    if (!job_desc || !user) {
      return res.status(400).json({ message: "job_desc and user are required" });
    }

    pdfPath = req.file.path;
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);

    let analysis = fallbackAnalysis(pdfData.text, job_desc);

    if (cohere) {
      const prompt = `
You are a resume screening assistant.
Compare this resume text with this job description and return output in exactly:
Score: XX
Reason: ...

Resume:
${pdfData.text}

Job Description:
${job_desc}
`;
      try {
        const response = await cohere.chat({
          model: cohereModel,
          message: prompt,
          temperature: 0.4,
        });

        const resultText = response?.text || "";
        if (resultText.trim()) {
          analysis = parseScoreAndReason(resultText);
        }
      } catch (cohereErr) {
        console.error("Cohere API error, using fallback analysis:", cohereErr?.message || cohereErr);
      }
    }

    const newResume = new ResumeModel({
      user,
      resume_name: req.file.originalname,
      job_desc,
      score: analysis.score,
      feedback: analysis.feedback,
    });

    await newResume.save();
    return res.status(200).json({ message: "Your analysis is ready", data: newResume });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error", message: err.message });
  } finally {
    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }
  }
};

exports.getAllResumesForUser = async (req, res) => {
  try {
    const { user } = req.params;
    const resumeData = await ResumeModel.find({ user }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "User resume history fetched successfully",
      data: resumeData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", message: err.message });
  }
};

exports.getResumeForAdmin = async (req, res) => {
  try {
    const resumeData = await ResumeModel.find({})
      .populate("user", "name email role photoUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All resumes fetched successfully",
      data: resumeData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", message: err.message });
  }
};
