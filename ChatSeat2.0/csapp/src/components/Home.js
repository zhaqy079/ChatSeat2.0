import { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import Seat from "../assets/Seat.JPG";
import HomePMBtn from "../components/HomePMBtn";
import HomePMForm from "../components/HomePMForm";

export default function Home() {
    const [showForm, setShowForm] = useState(false);
    const [messageSent, setMessageSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        Aos.init({ duration: 800, once: false, mirror: true });
    }, []);

    useEffect(() => {
        if (messageSent || errorMessage) {
            const timer = setTimeout(() => setMessageSent(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [messageSent, errorMessage]);

    return (
        <div className="bg-white">
            <div className="container py-4 py-md-5">
                {/* Intro */}
                <div className="text-center mb-4 mb-md-5" data-aos="fade-up">
                    <h2 className="fs-3 fs-md-2 fw-bold intro-title">
                        Welcome to “Chat Seats”
                    </h2>
                    <p className="lead fs-6">
                        The <strong>Chat Seats</strong> initiative provides a safe, inviting place
                        for people to talk and <strong>connect through conversation</strong>. We’re
                        looking for volunteers to be Listeners and/or Coordinators.
                    </p>
                </div>

                {/* Two columns: Listeners / Coordinators */}
                <div className="row g-3 g-md-4 mb-4" data-aos="fade-up">
                    <div className="col-12 col-md-6">
                        <div className="bg-info-subtle p-4 rounded-3 shadow h-100">
                            <h3 className="h5 fw-bold intro-title">Listeners</h3>
                            <p className="mb-2">
                                Listeners volunteer time to sit at a Chat Seat and listen to community
                                members who join them—helping people reconnect through conversation.
                            </p>
                            <p className="mb-2">
                                A great Listener enjoys listening and can spend a couple of hours
                                each week at a Chat Seat.
                            </p>
                            <p className="mb-0">
                                Sign in to access helpful information, a booking calendar, and a place
                                to chat with other Listeners.
                            </p>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="bg-success-subtle p-4 rounded-3 shadow h-100">
                            <h3 className="h5 fw-bold intro-title">Coordinators</h3>
                            <p className="mb-2">
                                Coordinators (often also Listeners) help establish sites and support
                                volunteers. They liaise with venue managers and keep schedules organised.
                            </p>
                            <p className="mb-0">
                                Sign in to access coordinator resources and communication tools.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info blocks */}
                <div className="row g-3 g-md-4 mb-4" data-aos="fade-up">
                    <div className="col-12 col-md-6">
                        <div className="bg-primary-subtle p-4 rounded-3 shadow-sm border-start border-4 border-primary h-100">
                            <h3 className="h5 fw-semibold text-primary mb-2">About the Chat Seat</h3>
                            <p className="mb-0">
                                We’ll be setting up a Chat Seat in your venue. The goal is to help
                                community members connect through conversation.
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="bg-warning-subtle p-4 rounded-3 shadow-sm border-start border-4 border-warning h-100">
                            <h3 className="h5 fw-semibold text-warning mb-2">Who We’re Looking For</h3>
                            <p className="mb-0">
                                People who enjoy listening and can commit two hours a week. We’re
                                currently looking for five volunteers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Banner image */}
                <div className="text-center mb-4" data-aos="fade-up">
                    <br/>
                    <h4 className="h6 h5-md mb-3 fw-semibold ">How do you identify a Chat Seat?</h4>
                    <p className="mb-3">
                        Look for a banner like the one below at one of our Chat Seat locations.
                    </p>
                    <img
                        src={Seat}
                        alt="Chat Seat Banner"
                        className="d-block mx-auto img-fluid rounded-3 shadow"
                        style={{ maxWidth: 420 }}
                    />
                </div>

                {/*PM feature*/}
                <div className="d-flex justify-content-end">
                    <HomePMBtn onOpen={() => setShowForm(true)} />
                </div>
                {showForm && (
                    <div className="form-container-floating">
                        <HomePMForm
                            onClose={() => setShowForm(false)}
                            onSent={() => setMessageSent(true)}
                            onError={(msg) => setErrorMessage(msg)}
                        />
                    </div>
                   
                )}
                {messageSent && (
                    <div className="pm-alert" role="alert">
                         Message sent! Thank you for reaching out.
                    </div>
                )}

                {errorMessage && (
                    <div className="pm-alert bg-danger-subtle" role="alert">
                        {errorMessage}
                    </div>
                )}

                {/* Closing */}
                <div className="p-4 rounded-3 text-center shadow-sm bg-light" data-aos="fade-up">
                    <p className="fs-6 mb-1">
                        We hope you have the passion and time to be part of this initiative.
                    </p>
                    <p className="fs-6 mb-3">
                        Thank you for visiting. We welcome your suggestions.
                    </p>
                    <div className="text-primary">
                        <p className="mb-0 intro-title">Warm regards,</p>
                        <p className="mb-0 intro-title">Tricia and Noel</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
