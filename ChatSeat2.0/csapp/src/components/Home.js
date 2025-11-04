import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import Seat from "../assets/Seat.JPG";
import HomePMBtn from "../components/HomePMBtn";
import HomePMForm from "../components/HomePMForm";

export default function Home() {
    const navigate = useNavigate();
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
                            In a bid to tackle social isolation, we would like to establish a series of 
                            <strong> Chat Seats</strong> across Australia. The <strong>Chat Seats initiative </strong>
                            aims to provide a safe and inviting place for people to talk. It will allow members
                        of the community to <strong> "Connect through Conversation." </strong>
                            For this initiative to be successful, we need people like yourselves to volunteer
                            to be either <strong>Listeners</strong> and/or <strong>Coordinators</strong>.
                            
                    </p>
                </div>

                {/* Two columns: Listeners / Coordinators */}
                <div className="row g-3 g-md-4 mb-4" data-aos="fade-up">
                    <div className="col-12 col-md-6">
                        <div className="bg-info-subtle p-4 rounded-3 shadow h-100">
                            <h3 className="h5 fw-bold">Listeners</h3>
                            <p className="mb-2">
                                Listeners are individuals who volunteer their time to sit on a Chat Seat and listen to members of the community who may join them.
                                Some of these members of the community may also be lonely and/or isolated.
                                We are hoping to connect them back into their community through conversation.
                            </p>
                            <p className="mb-2">
                                So, who would be a great volunteer?
                                Someone who enjoys listening to other people and is interested in what is happening for them.
                                Also, someone who has a couple of hours each week where they would like to sit at one of our Chat Seat locations.
                                Does this sound like you?
                            </p>
                            <p className="mb-0">
                                If you would like to volunteer as a Listener, then you will need to sign in and proceed to the page for Listeners.
                                On this page you will find some helpful information, a booking calendar and a place where you can chat with other Listeners.
                            
                            </p>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="bg-success-subtle p-4 rounded-3 shadow h-100">
                            <h3 className="h5 fw-bold">Coordinators</h3>
                            <p className="mb-2">
                                Coordinators are individuals who are also volunteers and may also choose to be Listeners.
                                They will help to establish a site and support the Listeners.
                                So, who would be a good Coordinator? Someone who enjoys negotiating with potential venue "managers" and has good organisational skills.
                            </p>
                            <p className="mb-0">
                                If you would like to volunteer as a Coordinator, then you will need to sign in and proceed to the page for Coordinators.
                                On this page you will find some helpful information, and a place where you can chat with other Coordinators.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info blocks */}
                <div className="row g-3 g-md-4 mb-4" data-aos="fade-up">
                    <div className="col-12 col-md-6">
                        <div className="bg-primary-subtle p-4 rounded-3 shadow-sm border-start border-4 border-primary h-100">
                            <h3 className="h5 fw-semibold text-primary mb-2">About the Chat Seats</h3>
                            <p className="mb-2">
                                We’ll be setting up Chat seats in various venues. 
                                You can go to the venues options to see where Chat seats currently operate.
                            </p>
                            <p className="mb-0">
                                If you would like a Chat Seat to open in a different location then please email us via the “Have a Chat” tab.
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="bg-warning-subtle p-4 rounded-3 shadow-sm border-start border-4 border-warning h-100">
                            <h3 className="h5 fw-semibold text-warning mb-2">Who We’re Looking For</h3>
                            <p className="mb-0">
                                We are looking for Volunteers who might like to be Listeners and/or Coordinators. 
                            </p>
                            <br/>
                            <button type="button" className="btn btn-primary" onClick={() => navigate("/signup")}>Interested? Sign up!</button>
                        </div>
                    </div>
                </div>

                {/* Banner image */}
                <div className="text-center mb-4" data-aos="fade-up">
                    <br/>
                    <h2 className="h6 h5-md mb-3 fw-semibold ">How do you identify a Chat Seat?</h2>
                    <p className="mb-3">
                        It will have a banner like the one below, at one of our Chat Seats locations.
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
                         Message sent! We’ll be in touch soon.
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
                        Thank you for taking the time to visit our website. We welcome any suggestions.
                    </p>
                    <div className="text-primary">
                        <h6 className="mb-0 intro-title">
                            Warm regards,<br /> <br />Tricia and Noel
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    );
}
