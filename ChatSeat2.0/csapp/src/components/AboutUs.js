import React from "react";
import { useNavigate } from "react-router-dom";
import teamIcon from "../assets/icons/icons8-smiling-face-48.png";

export default function AboutUs() {
    const navigate = useNavigate();

    return (
        <div className="bg-white">
            <div className="container py-4 py-md-5">

                {/* Page Title */}
                <div className="text-center mb-4 mb-md-5" data-aos="fade-up">
                
                    <h2 className="fs-3 fs-md-2 fw-bold intro-title">About Us</h2>
                    <p className="lead text-muted">
                        <em>Connecting people, one conversation at a time.</em>
                    </p>
                    <p className="text-muted mt-2">
                        <strong>Have a Chat Seat</strong> is a volunteer-led initiative bringing people together
                        in libraries, shopping centres, and public spaces to share conversations and reduce loneliness.
                    </p>
                </div>

                {/* Founders Section */}
                <div className="text-center mb-4 mb-md-5" data-aos="fade-up">
                    <h2 className="fs-3 fs-md-2 fw-bold intro-title">Meet the Founders</h2>
                    <p className="text-muted mb-4">
                        Chat Seats began with two passionate individuals who believed that connection and conversation
                        can change lives. Here's their story.
                    </p>
                    <div className="row g-4">
                        <div className="col-12 col-md-6">
                            <div className="bg-info-subtle p-4 rounded-3 shadow h-100">
                            <h4 className="h5 fw-bold intro-title">Dr Tricia Vilkinas, B.SC., B. Comm., M.Psych.</h4>
                            <p>
                                In my working life, I was the Foundation Professor of Management at University of South
                                Australia (now Adelaide University). My research has mainly focused on leadership as has
                                my teaching. My other interests are time with my husband and my family, particularly those
                                grandchildren, traveling in regional and remote Australia, time with friends, gardening,
                                and crafty things.
                            </p>
                            <p className="mt-3">
                                I have always had an interest in people, talking with them, wanting to understand their life,
                                story, and what makes them happy and/or sad. Just getting to know them.
                            </p>
                            <p className="mt-3">
                                The <strong>Chat Seats</strong> initiative, while not a new idea, is a great opportunity to connect
                                members in our community, particularly those who may be feeling isolated and lonely.
                            </p>
                            </div>
                        </div>

                    <div className="col-12 col-md-6" data-aos="fade-up">
                            <div className="bg-success-subtle p-4 rounded-3 shadow h-100">
                            <h4 className="h5 fw-bold intro-title">Noel Fraser</h4>
                            <p className="mt-3">
                                Noel experienced extreme loneliness for most of his life, including throughout the entirety
                                of a twenty-year stint in the Army. A chance conversation set him on the path to making
                                some important life choices, including in his case the need to take the first important step
                                    of forgiveness.
                            </p>
                            <p className="mt-3">
                               Deciding to 'get better, not stay bitter' and approaching the age of 50,
                               Noel decided to undertake a Behavioural Sciences degree, applying via the Flinders
                               University Foundation program for aged students.
                            </p>
                            <p className="mt-3">
                                More recently, he participated in the SA
                                Governors Leadership Foundation (GLF) program and through a GLF alumni newsletter, read
                                about and then volunteered to help plan and initiate Tricia's Chat Seats idea in his local area.
                            </p>
                            </div>
                        </div>
                    </div>
                </div>

       

            {/* Mission / Vision Section */}
                <div className="text-center mb-4 mb-md-5">
                    <h2 className="fs-3 fs-md-2 fw-bold intro-title mb-3">Our Mission</h2>
                    <p className="text-muted mb-4">
                        Chat Seats creates welcoming spaces for community members to connect, share stories,
                        and reduce isolation.
                    </p>
                    <p className="text-muted">
                        Since starting in Campbelltown Library, the initiative has grown into a national model.
                        Join us as a Listener or Coordinator and make a meaningful difference.
                    </p>
                 
                    <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
                        <button className="btn btn-outline-success px-4" data-bs-toggle="collapse" data-bs-target="#creditsCollapse">
                            Learn More
                        </button>
                    </div>
                    <div id="creditsCollapse" className="collapse mt-3">
                        <div className="card shadow-sm border-0" style={{ maxWidth: 760, margin: "0 auto" }}>
                            <div className="card-body">
                                <h5 className="fw-semibold mb-3 text-center text-secondary">
                                    Project Acknowledgements
                                </h5>
                                <p className="text-muted text-center mb-4">
                                    Developed in collaboration with the <strong>Have a Chat Seat</strong> community
                                    program as part of the University of South Australia (UniSA) Capstone Project
                                    for the final year of the Bachelor of Information Technology.
                                </p>

                                <ul
                                    className="list-unstyled text-muted mb-0"
                                    style={{ lineHeight: 1.8, fontSize: "0.95rem" }}
                                >
                                    <li><strong>Project:</strong> ChatSeat 2.0 Scheduling Platform Revamp</li>
                                    <li><strong>Client:</strong> Dr. Tricia Vilkinas</li>
                                    <li><strong>Supervisor:</strong> Dr. Douglas Kelly</li>
                                    <li><strong>Current Team:</strong> Qianting Zhang, Jordon Cursaro, Callum Malycha</li>
                                    <li><strong>Contact:</strong> qiantingzhang978@gmail.com · Jorcursa@gmail.com · callummalycha@gmail.com</li>
                                    <li><strong>Technologies:</strong> React · Supabase · .NET Core · Bootstrap</li>
                                    <li>
                                        <strong>Icons:</strong>{" "}
                                        <a
                                            href="https://icons8.com/icons"
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ color: "#198754" }}
                                        >
                                            Icons8
                                        </a>
                                    </li>
                                    <li><strong>Previous Development:</strong>Darshi Gabani, Chun Ho Chan</li>
                                    <li><strong>Contact:</strong> darshi.gabani2001@gmail.com · chacy239@gmail.com</li>
                                </ul>

                                <p className="text-center text-secondary mt-4" style={{ fontSize: "0.85rem" }}>
                                    © {new Date().getFullYear()} ChatSeat 2.0 · Developed by ICT 28 Team with  
                                    <img src={teamIcon} alt="" className="icon" style={{ width: 24, height: 24 }} aria-hidden="true" />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      
    );
}
