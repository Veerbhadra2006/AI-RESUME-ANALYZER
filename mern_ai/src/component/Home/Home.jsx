import React from 'react'
import FeaturesCard from './FeaturesCard'
import StepsCard from './StepsCard'
import { Link } from 'react-router-dom'
import "./home.css"

const features = [
    {
        title: 'AI Resume Audit',
        description:
            'Get section-by-section feedback on clarity, impact, and ATS compatibility in seconds.',
    },
    {
        title: 'Smart Job Matching',
        description:
            'Match your profile against job descriptions and see fit scores with missing-skill insights.',
    },
    {
        title: 'Keyword Optimizer',
        description:
            'Improve your resume with role-specific keywords that help your application rank better.',
    },
    {
        title: 'Role Readiness Score',
        description:
            'Track your readiness across target roles and prioritize improvements that move the needle.',
    },
]

const steps = [
    {
        title: 'Upload Resume',
        detail: 'Import PDF or DOCX and let the parser structure your profile data.',
    },
    {
        title: 'Analyze & Compare',
        detail: 'The platform evaluates your resume against market and job-specific requirements.',
    },
    {
        title: 'Improve & Apply',
        detail: 'Use personalized suggestions, update your resume, and apply with confidence.',
    },
]

const Home = () => {
    return (
        <div className="home-container dark">

            <div className="main-wrapper">

                <header className="main-header">
                    <div className="logo-section">
                        <div className="logo-box" />
                        <div>
                            <p className="tagline">Resume Intelligence</p>
                            <h1>AI Resume Analyzer</h1>
                        </div>
                    </div>

                    <Link to="/Login">
                        <button className="outline-btn">Login / Signup</button>
                    </Link>
                </header>

                <section className="hero-section">
                    <div className="hero-grid">
                        <div>
                            <p className="hero-badge">Built for faster hiring success</p>

                            <h2 className="hero-title">
                                Turn your resume into a
                                <span> job-winning profile</span>
                            </h2>

                            <p className="hero-desc">
                                Analyze your resume with AI, identify gaps against job descriptions,
                                and optimize for interviews with actionable recommendations.
                            </p>

                            <div className="hero-buttons">
                                <Link to="/Login">
                                    <button className="primary-btn">Analyze My Resume</button>
                                </Link>
                                <Link to="/Login">
                                    <button className="secondary-btn">Explore Job Matching</button>
                                </Link>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-card">
                                    <p>91%</p>
                                    <span>ATS Coverage</span>
                                </div>
                                <div className="stat-card">
                                    <p>2.8x</p>
                                    <span>More Shortlists</span>
                                </div>
                                <div className="stat-card">
                                    <p>30s</p>
                                    <span>Avg Scan Time</span>
                                </div>
                            </div>
                        </div>

                        <div className="preview-card">
                            <p className="preview-title">Live Analysis Preview</p>

                            <div className="analysis-box strength">
                                <p>Strength</p>
                                <span>Clear project impact with measurable outcomes.</span>
                            </div>

                            <div className="analysis-box improve">
                                <p>Improve</p>
                                <span>Add role-specific keywords: React testing, REST API design.</span>
                            </div>

                            <div className="analysis-box match">
                                <p>Match Score</p>
                                <span>Frontend Developer role match: 84/100</span>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="features-section">
                    <h3 className="features-heading">What You Get</h3>

                    <p className="features-subtext">
                        Everything you need to improve resume quality and align with the right opportunities.
                    </p>

                    <div className="features-grid">
                        {features.map((feature) => (
                            <FeaturesCard key={feature.title} feature={feature} />
                        ))}
                    </div>
                </section>


                <section className="steps-section">
                    <h3 className="steps-heading">How It Works</h3>

                    <div className="steps-grid">
                        {steps.map((step, index) => (
                            <StepsCard key={step.title} index={index} step={step} />
                        ))}
                    </div>
                </section>

            </div>
        </div>
    )
}

export default Home
