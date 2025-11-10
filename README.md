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

## 3. Development Setup 
### 3.1 Clone the Repository  

**Method 1: Using Git command**

```bash
 git clone https://github.com/zhaqy079/ChatSeat2.0 
```
**Method 2: Manual download**
You can also download the .zip file from GitHub and extract it locally.
Then initialize a Git repository if needed:

```bash
git init
```
### 3.2 Supabase & Environment Configuration (.env)
ChatSeat 2.0 continues using the original ChatSeats Supabase project, with a new instance configured for version 2.0.
Inside the /csapp directory (same level as /src/), create a new file named .env and add:

```bash
REACT_APP_SUPABASE_URL=https://chatseat2.0theproject.supabase.co
REACT_APP_SUPABASE_ANON_KEY=chatseat2.0_anon_key
```

#### Notes:
- You can find your URL and Anon Key inside your Supabase dashboard under
Project Settings → API → Project URL / anon key.
- Never commit .env files to GitHub — they contain sensitive credentials.
- React only loads environment variables starting with REACT_APP_.
- Create a .gitignore file and include .env to prevent accidental uploads.

### 3.3 Install Dependencies & Run Locally
At your ChatSeat 2.0 project folder, open your terminal or command prompt and run:

```bash
cd csapp
npm install
npm start
```

## 4. Key Routes

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

