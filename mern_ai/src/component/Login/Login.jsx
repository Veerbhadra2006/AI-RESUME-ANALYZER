import React, { useContext } from 'react'
import styles from './Login.module.css';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GoogleIcon from '@mui/icons-material/Google';

import { auth, provider } from '../../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const Login = () => {

    const { setLogin, setUserInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const response = await signInWithPopup(auth, provider);
            const firebaseUser = response?.user;

            if (!firebaseUser?.email) {
                throw new Error("Unable to fetch user details from Google");
            }

            const backendResponse = await axios.post('/api/user', {
                name: firebaseUser.displayName || "Unknown User",
                email: firebaseUser.email,
                photoUrl: firebaseUser.photoURL || ""
            });

            const appUser = backendResponse?.data?.user;
            if (!appUser) {
                throw new Error("Unable to create/fetch user from backend");
            }

            setLogin(true);
            setUserInfo(appUser);
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("userInfo", JSON.stringify(appUser));

            navigate('/dashboard')
        } catch (err) {
            alert("Something Went Wrong");
            console.log(err)
        }
    }
    return (
        <div className={styles.Login}>
            <div className={styles.loginShell}>
                <section className={styles.loginShowcase}>
                    <p className={styles.showcaseEyebrow}>AI Resume Platform</p>
                    <h1 className={styles.showcaseTitle}>Screen Better. Hire Faster.</h1>
                    <p className={styles.showcaseText}>Sign in to analyze resumes against job roles and get instant fit feedback powered by AI.</p>

                    <div className={styles.showcaseStats}>
                        <div className={styles.statCard}>
                            <p className={styles.statValue}>95%</p>
                            <p className={styles.statLabel}>Matching accuracy</p>
                        </div>
                        <div className={styles.statCard}>
                            <p className={styles.statValue}>Instant</p>
                            <p className={styles.statLabel}>Role fit feedback</p>
                        </div>
                    </div>
                </section>

                <section className={styles.loginCard}>
                    <div className={styles.loginCardTitle}>
                        <h2>Welcome Back</h2>
                        <span className={styles.keyBadge}>
                            <VpnKeyIcon sx={{ fontSize: 18 }} />
                        </span>
                    </div>

                    <p className={styles.loginHint}>Continue with your Google account to access dashboard and history.</p>

                    <div className={styles.featureList}>
                        <div className={styles.featureItem}>Resume score and gap analysis</div>
                        <div className={styles.featureItem}>Previous reports in history</div>
                        <div className={styles.featureItem}>Admin tools for monitoring</div>
                    </div>

                    <div className={styles.googleBtn} onClick={handleLogin}>
                        <GoogleIcon sx={{ fontSize: 20, color: "#ef4444" }} />
                        <span>Sign in with Google</span>
                    </div>

                    <p className={styles.trustText}>We only use your sign-in info to authenticate your account.</p>
                </section>
            </div>
        </div>
    )
}

export default Login
