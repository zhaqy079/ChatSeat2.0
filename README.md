# ChatSeats 2.0 

Community connection platform powered by React, Supabase, and Hostinger.

<p align="center">
  <img src="ChatSeat2.0/csapp/public/chatseatLogo.png" width="300" alt="ChatSeats Logo">
</p>

**Authors & Contact:**  
- Qianting Zhang · [qiantingzhang978@gmail.com](mailto:qiantingzhang978@gmail.com)  
- Jordon Cursaro · [jorcursa@gmail.com](mailto:jorcursa@gmail.com)  
- Callum Malycha · [callummalycha@gmail.com](mailto:callummalycha@gmail.com)

## 1. Summary of Key Updates 
**ChatSeat 2.0** is the upgraded version of the original [ChatSeat 1.0](https://github.com/GABDY005/ChatSeat), built to enhance platform stability, authentication, and overall user experience.  


### Key improvements include:
	- Full Supabase database table sort &  authentication integration (Sign up, Login, Forgot/Reset Password)
	- User Friendly Role-based dashboards for Admin, Coordinator, and Listener Update
	- Secure environment configuration & Protected routes
	- Resend integration with Hostinger domain email (no-reply@chatseats.com.au)
	- Updated .htaccess configuration for SPA routing on Hostinger
	- Password policy enforcement + Yup validation alignment with Supabase rules
	- Refined production deployment under /public_html
	
## 2. Tech Stack
| Category | Technology |
|-----------|-------------|
| **Frontend** | React (React Router v6, JavaScript, Redux, Bootstrap 5) |
| **Backend** | Supabase (Auth + Postgres Database) |
| **Email** | Resend API + Hostinger SMTP domain |
| **Hosting** | Hostinger (Apache server, SPA rewrite) |
| **Validation** | Yup & React Hook Form |
| **State Management** | Redux Toolkit |
| **Deployment** | npm build → upload /build to /public_html |


## 3. Key Routes

| Route | Description |
|--------|-------------|
| `/` | Home page |
| `/login` | User login |
| `/signup` | User signup |
| `/resetrequest` | Request password reset email |
| `/reset-password` | Password reset form (redirect target in Supabase email) |
| `/admindashboard` | Admin main dashboard |
| `/adminSchedulingSetting` | Admin key feature ⭐⭐⭐ |
| `/admineditresource` | Admin key feature ⭐⭐ |
| `/coordinatordashboard` | Coordinator main dashboard |
| `/coordinatorappointments` | Coordinator key feature ⭐⭐⭐ |
| `/coordinatoravailability` | Coordinator key feature ⭐⭐ |
| `/listenerdashboard` | Listener main dashboard |
| `/privatemessage` | Listener key feature ⭐⭐⭐ |
| `/venues` | Venue search & display |
| `/about` | About the project page |

