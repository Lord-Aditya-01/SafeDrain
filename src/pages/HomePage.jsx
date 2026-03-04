import { useNavigate } from "react-router-dom";

const HomePage = () => {

  const navigate = useNavigate();

  return (
    <div style={{
      background: "#020617",
      color: "white",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif"
    }}>

      {/* HEADER */}
      <div style={{
        textAlign: "center",
        padding: "40px 20px",
        borderBottom: "1px solid #1e293b"
      }}>
        <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>
          SafeDrain
        </h1>

        <p style={{ opacity: 0.8 }}>
          Smart Manhole Worker Safety Monitoring System
        </p>

        <div style={{ marginTop: "25px" }}>
          <button
            onClick={() => navigate("/worker-login")}
            style={btnStyle}
          >
            Worker Login
          </button>

          <button
            onClick={() => navigate("/supervisor-login")}
            style={{ ...btnStyle, marginLeft: "10px" }}
          >
            Supervisor Login
          </button>
        </div>
      </div>


      {/* CONTENT */}
      <div style={{ maxWidth: "1000px", margin: "auto", padding: "40px 20px" }}>

        <Section
          title="Problem We Are Solving"
          text="Sanitation workers face dangerous conditions inside manholes including toxic gases, lack of monitoring, and delayed emergency response. Many accidents occur due to absence of real-time safety systems."
        />

        <Section
          title="How Our System Works"
          text="SafeDrain provides a real-time monitoring platform where workers share their location and safety data while supervisors monitor them through a live dashboard."
        />

        <Section
          title="Complete Workflow"
          text="Worker logs in → GPS tracking starts → Gas levels and work status monitored → Data sent to backend → Supervisor dashboard displays worker data → SOS alerts trigger emergency notifications."
        />

        <Section
          title="How Our Product Addresses the Problem"
          text="SafeDrain enables real-time tracking, gas monitoring, emergency alerts, and supervisor monitoring to improve worker safety and reduce response time in hazardous environments."
        />

        <Section
          title="Feasibility & Viability"
          text="The system is built using low-cost web technologies and can be deployed easily by municipal corporations and sanitation departments."
        />

        <Section
          title="Challenges Faced"
          text="Challenges included handling real-time socket communication, GPS accuracy, worker logout ghost sessions, and maintaining stable backend communication."
        />

        <Section
          title="Impact & Benefits"
          text="SafeDrain improves worker safety, enables faster emergency response, provides real-time monitoring, and helps reduce accidents during manhole operations."
        />

        <Section
          title="Business Model"
          text="SafeDrain can be offered as a safety monitoring platform for municipal corporations and smart city sanitation departments through subscription-based deployment."
        />

        <Section
          title="Future Scope"
          text="Future improvements include IoT gas sensors, wearable safety devices, AI-based risk prediction, and mobile applications for field supervisors."
        />

        <Section
          title="Tech Stack"
          text="Frontend: React.js, Leaflet Maps | Backend: Node.js, Express.js, Socket.IO | Database: MongoDB | Deployment: Vercel & Render"
        />

        <Section
          title="Team"
          text="Developed by NIKARANA Team – Computer Engineering Students"
        />

      </div>


      {/* FOOTER */}
      <div style={{
        textAlign: "center",
        padding: "20px",
        borderTop: "1px solid #1e293b",
        opacity: 0.7
      }}>
        © 2026 SafeDrain Project – All Rights Reserved
      </div>

    </div>
  );
};


/* REUSABLE SECTION COMPONENT */
const Section = ({ title, text }) => (
  <div style={{ marginBottom: "30px" }}>
    <h2 style={{ marginBottom: "10px" }}>{title}</h2>
    <p style={{ opacity: 0.8, lineHeight: "1.6" }}>{text}</p>
  </div>
);


/* BUTTON STYLE */
const btnStyle = {
  padding: "12px 20px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: "15px"
};

export default HomePage;