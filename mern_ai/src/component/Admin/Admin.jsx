import React, { useState, useEffect, useMemo } from 'react'
import styles from './Admin.module.css';
import { Skeleton } from '@mui/material';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';


const Admin = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const summary = useMemo(() => {
    if (!data.length) {
      return {
        total: 0,
        avgScore: 0,
        topScore: 0
      };
    }

    const totalScore = data.reduce((acc, item) => acc + (Number(item?.score) || 0), 0);
    const topScore = data.reduce((acc, item) => Math.max(acc, Number(item?.score) || 0), 0);

    return {
      total: data.length,
      avgScore: Math.round(totalScore / data.length),
      topScore
    };
  }, [data]);

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  useEffect(() => {

    const fetchAllData = async () => {
      try {
        setLoader(true);
        const response = await axios.get('/api/resume/get');
        setData(response?.data?.data || []);
      } catch (err) {
        console.log(err);
        alert("Unable to load admin data");
      } finally {
        setLoader(false);
      }
    }

    fetchAllData()
  }, [])

  return (
    <div className={styles.Admin}>
      <div className={styles.AdminContent}>
        <div className={styles.AdminHeader}>
          <div className={styles.HeaderTop}>
            <p className={styles.Kicker}>Dashboard</p>
            <button
              type="button"
              className={styles.BackButton}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
          <h1>Resume Insights</h1>
          <p className={styles.Subtext}>Track applicant scores, feedback quality, and submissions in one place.</p>
        </div>

        <div className={styles.StatsGrid}>
          <div className={styles.StatCard}>
            <p>Total Submissions</p>
            <h2>{summary.total}</h2>
          </div>
          <div className={styles.StatCard}>
            <p>Average Score</p>
            <h2>{summary.avgScore}%</h2>
          </div>
          <div className={styles.StatCard}>
            <p>Top Score</p>
            <h2>{summary.topScore}%</h2>
          </div>
        </div>

        <div className={styles.AdminBlock}>
          {
            loader && Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={280}
                sx={{ borderRadius: "18px" }}
              />
            ))
          }

          {
            !loader && data.map((item) => {
              return (
                <div key={item._id} className={styles.AdminCard}>
                  <div className={styles.CardTop}>
                    <h3>{item?.user?.name || "Unknown User"}</h3>
                    <span className={styles.ScorePill}>{Number(item?.score) || 0}%</span>
                  </div>

                  <p className={styles.Meta}>{item?.user?.email || "No email available"}</p>
                  <div className={styles.InfoRow}>
                    <span>Resume</span>
                    <strong>{item?.resume_name || 'Untitled Resume'}</strong>
                  </div>
                  <div className={styles.InfoRow}>
                    <span>Submitted</span>
                    <strong>{formatDate(item?.createdAt)}</strong>
                  </div>

                  <div className={styles.FeedbackBlock}>
                    <span>Feedback</span>
                    <p>{item?.feedback || 'No feedback available.'}</p>
                  </div>
                </div>
              );
            })
          }

          {
            !loader && !data.length && (
              <div className={styles.EmptyState}>
                <h3>No submissions found</h3>
                <p>New resume analysis records will appear here once users start submitting resumes.</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default WithAuthHOC(Admin);
