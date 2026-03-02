
import styles from './History.module.css';
import { Skeleton } from '@mui/material';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useState, useEffect, useContext, useMemo } from 'react';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const { userInfo } = useContext(AuthContext);

  const summary = useMemo(() => {
    if (!data.length) {
      return {
        total: 0,
        avgScore: 0,
        bestScore: 0
      };
    }

    const totalScore = data.reduce((acc, item) => acc + (Number(item?.score) || 0), 0);
    const bestScore = data.reduce((acc, item) => Math.max(acc, Number(item?.score) || 0), 0);

    return {
      total: data.length,
      avgScore: Math.round(totalScore / data.length),
      bestScore
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
    if (!userInfo?._id) return;

    const fetchUserData = async () => {
      try {
        setLoader(true);
        const response = await axios.get(`/api/resume/get/${userInfo._id}`);
        setData(response?.data?.data || []);
      } catch (err) {
        console.log(err);
        alert("Unable to load history");
      } finally {
        setLoader(false);
      }
    }

    fetchUserData()
  }, [userInfo?._id])

  return (
    <div className={styles.History}>
      <div className={styles.HistoryContent}>
        <section className={styles.HistoryHeader}>
          <div className={styles.HeaderTop}>
            <p className={styles.Kicker}>Your Timeline</p>
            <button
              type="button"
              className={styles.BackButton}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
          <h1>Analysis History</h1>
          <p className={styles.Subtext}>Review all your previous resume checks with score trends and feedback details.</p>
        </section>

        <section className={styles.StatsGrid}>
          <div className={styles.StatCard}>
            <p>Total Analyses</p>
            <h2>{summary.total}</h2>
          </div>
          <div className={styles.StatCard}>
            <p>Average Score</p>
            <h2>{summary.avgScore}%</h2>
          </div>
          <div className={styles.StatCard}>
            <p>Best Score</p>
            <h2>{summary.bestScore}%</h2>
          </div>
        </section>

        <section className={styles.HistoryCardBlock}>
          {
            loader && Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={230}
                sx={{ borderRadius: "18px" }}
              />
            ))
          }

          {
            !loader && data.map((item) => {
              return (
                <article key={item._id} className={styles.HistoryCard}>
                  <div className={styles.CardTop}>
                    <h3>{item?.resume_name || 'Untitled Resume'}</h3>
                    <span className={styles.ScorePill}>{Number(item?.score) || 0}%</span>
                  </div>

                  <div className={styles.InfoRow}>
                    <span>Analyzed On</span>
                    <strong>{formatDate(item?.createdAt)}</strong>
                  </div>

                  <div className={styles.FeedbackBlock}>
                    <span>Feedback</span>
                    <p>{item?.feedback || 'No feedback available.'}</p>
                  </div>
                </article>
              );
            })
          }

          {
            !loader && !data.length && (
              <div className={styles.EmptyState}>
                <h3>No history yet</h3>
                <p>Upload a resume from dashboard to generate your first analysis record.</p>
              </div>
            )
          }
        </section>
      </div>
    </div>
  )
}

export default WithAuthHOC(History)
