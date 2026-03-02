import styles from './Dashboard.module.css'
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import Skeleton from '@mui/material/Skeleton';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useContext, useState } from 'react';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';

const Dashboard = () => {
    const [uploadFiletext, setUploadFileText] = useState("Upload your resume");
    const [loading, setLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDesc, setJobDesc] = useState("");

    const [result, setResult] = useState(null);

    const { userInfo } = useContext(AuthContext);

    const handleOnChangeFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setResumeFile(file);
        setUploadFileText(file.name);
    }

    const handleUpload = async () => {
        if (!resumeFile) {
            alert("Please upload your resume first");
            return;
        }
        if (!jobDesc.trim()) {
            alert("Please paste job description");
            return;
        }
        if (!userInfo?._id) {
            alert("User not found. Please login again.");
            return;
        }

        try {
            setLoading(true);
            setResult(null);

            const formData = new FormData();
            formData.append("resume", resumeFile);
            formData.append("job_desc", jobDesc);
            formData.append("user", userInfo._id);

            const response = await axios.post('/api/resume/addResume', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setResult(response?.data?.data || null);
        } catch (err) {
            console.log(err);
            alert("Failed to analyze resume");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.dashboard}>
            <section className={styles.heroBanner}>
                <div className={styles.heroCopy}>
                    <p className={styles.heroEyebrow}>AI powered resume intelligence</p>
                    <h1 className={styles.heroTitle}>Build A Role-Ready Resume Match Report</h1>
                    <p className={styles.heroText}>Upload resume, add job description, and generate an instant fit score with feedback.</p>
                </div>

                <div className={styles.heroProfile}>
                    <img className={styles.profileImg} src={userInfo?.photoUrl} alt="User profile" />
                    <div className={styles.profileMeta}>
                        <p className={styles.profileLabel}>Logged in as</p>
                        <h2 className={styles.profileName}>{userInfo?.name}</h2>
                    </div>
                </div>
            </section>

            <section className={styles.stepsRow}>
                <ol className={styles.dashboardInstruction}>
                    <li className={styles.stepItem}>
                        <span className={styles.stepIndex}>01</span>
                        <span>Upload resume PDF</span>
                    </li>
                    <li className={styles.stepItem}>
                        <span className={styles.stepIndex}>02</span>
                        <span>Paste job description</span>
                    </li>
                    <li className={styles.stepItem}>
                        <span className={styles.stepIndex}>03</span>
                        <span>Analyze and review feedback</span>
                    </li>
                </ol>
            </section>

            <section className={styles.workflowGrid}>
                <article className={styles.uploadPanel}>
                    <h3 className={styles.panelTitle}>Resume Source</h3>
                    <div className={styles.uploadCard}>
                        <div className={styles.uploadField}>
                            <CreditScoreIcon sx={{ marginRight: 1 }} />
                            <div className={styles.uploadLabel}>{uploadFiletext}</div>
                        </div>
                    </div>
                    <input className={styles.hiddenFileInput} id="resumeUpload" type="file" accept=".pdf" onChange={handleOnChangeFile} />
                    <label htmlFor="resumeUpload" className={styles.uploadBtn}>Choose Resume</label>
                </article>

                <article className={styles.jobPanel}>
                    <h3 className={styles.panelTitle}>Target Job Description</h3>
                    <textarea value={jobDesc} onChange={(e) => { setJobDesc(e.target.value) }} className={styles.textArea} placeholder='Paste your job description here...' rows={10} cols={50} />
                    <div className={styles.analyzeBtn} onClick={handleUpload} >Analyze Resume</div>
                </article>
            </section>

            <section className={styles.outputZone}>
                {
                    loading && <Skeleton variant="rectangular" sx={{ borderRadius: "20px" }} width="100%" height={210} />
                }

                {
                    result && <article className={styles.resultCard}>
                        <p className={styles.resultLabel}>Result</p>
                        <h2 className={styles.resultScore}>{result?.score || 0}%</h2>
                        <p className={styles.resultFeedback}>{result?.feedback || "No feedback available"}</p>
                    </article>
                }

                {
                    !loading && !result && <article className={styles.waitingCard}>
                        <p className={styles.waitingTitle}>Ready for analysis</p>
                        <p className={styles.waitingText}>Your fit score and personalized feedback will appear here after you click Analyze Resume.</p>
                    </article>
                }
            </section>
        </div>
    )
}

export default WithAuthHOC(Dashboard)
