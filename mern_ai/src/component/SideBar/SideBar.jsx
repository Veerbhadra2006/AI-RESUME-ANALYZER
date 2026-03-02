import React from 'react'
import styles from './SideBar.module.css';
import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';

const SideBar = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { isLogin, setLogin, userInfo, setUserInfo } = useContext(AuthContext);
    const isAuthenticated = isLogin === true || isLogin === "true";

    const handleLogout = () => {
        localStorage.removeItem("isLogin");
        localStorage.removeItem("userInfo");
        setLogin(false);
        setUserInfo(null);
        navigate("/");
    }
    return (
        <div className={styles.sideBar}>
            <div className={styles.brandBlock}>
                <div className={styles.brandIconWrap}>
                    <ArticleIcon sx={{ fontSize: 30 }} />
                </div>
                <div className={styles.brandTextBlock}>
                    <p className={styles.brandEyebrow}>AI Workspace</p>
                    <div className={styles.sideBarTopContent}>Resume Screening</div>
                </div>
            </div>

            <div className={styles.sideBarOptionsBlock}>
                <p className={styles.navTitle}>Navigation</p>
                {
                    isAuthenticated ? (
                        <Link to={'/dashboard'} className={[styles.sideBarOption, location.pathname === '/dashboard' ? styles.selectedOption : null].join(' ')}>
                            <DashboardIcon sx={{ fontSize: 22 }} />
                            <div>Dashboard</div>
                        </Link>
                    ) : (
                        <Link to={'/'} className={[styles.sideBarOption, location.pathname === '/' ? styles.selectedOption : null].join(' ')}>
                            <DashboardIcon sx={{ fontSize: 22 }} />
                            <div>Login</div>
                        </Link>
                    )
                }

                <Link to={'/history'} className={[styles.sideBarOption, location.pathname === '/history' ? styles.selectedOption : null].join(' ')}>
                    <ManageSearchIcon sx={{ fontSize: 22 }} />
                    <div>History</div>
                </Link>
                {
                    isAuthenticated && userInfo?.role === "admin" && (
                        <Link to={'/admin'} className={[styles.sideBarOption, location.pathname === '/admin' ? styles.selectedOption : null].join(' ')}>
                            <AdminPanelSettingsIcon sx={{ fontSize: 22 }} />
                            <div>Admin</div>
                        </Link>
                    )
                }
                {
                    isAuthenticated && (
                        <div onClick={handleLogout} className={styles.sideBarOption}>
                            <LogoutIcon sx={{ fontSize: 22 }} />
                            <div>LogOut</div>
                        </div>
                    )
                }

            </div>

            <div className={styles.sideBarFooter}>
                <p className={styles.footerLabel}>Current User</p>
                <p className={styles.footerName}>{userInfo?.name || "Guest User"}</p>
            </div>
        </div>
    )
}

export default SideBar
