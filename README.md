# Technical Assessment

![Screenshot 2025-02-01 112820](https://github.com/user-attachments/assets/33c9c8c3-1150-4fd7-8f08-218dab7b0e8a)
![Screenshot 2025-02-01 112829](https://github.com/user-attachments/assets/afaee141-86e7-4ace-aa99-b1fceaa8daff)
![Screenshot 2025-02-01 112627](https://github.com/user-attachments/assets/3c9e5acb-f2e0-4162-9f49-c7e545424846)
![Screenshot 2025-02-01 112648](https://github.com/user-attachments/assets/cf66cf86-3d57-4906-bb51-112b0fe83c32)
![Screenshot 2025-02-01 112707](https://github.com/user-attachments/assets/de7518ea-9cdd-423c-af27-f46d9b39d283)
![Screenshot 2025-02-01 112723](https://github.com/user-attachments/assets/0ffc3430-83c7-43a2-9e99-aae362df5c86)
![Screenshot 2025-02-01 112746](https://github.com/user-attachments/assets/47988c7d-8089-4c1f-bc7e-05b13c7ae475)

### Technologies Used
1. Back-end: Node.js, Express.js
1. Front-end: React.js, Tailwind CSS
1. Database: MongoDB (NoSQL)
1. Authentication: JWT (JSON Web Tokens)
1. Other Libraries and Tools: Axios, React Router, Chart.js, Socket.io, bcrypt (for password hashing), etc.

## :hammer_and_wrench: how to run
### Prerequisites
1. **Node version 18.x.x**
1. **generate JWT secret key**
1. **setup MongoDB**

### Cloning the repository
```shell
git clone https://github.com/Vishal101022/Poll-sys.git
```
### Setup .env file
```js
MONGODB_URI= (required)
PORT=5000
JWT_SECRET= (required)
FRONTEND_URL=http://frontend.url

CRYPTO_KEY=crypto_key    (not required)
SESSION_SECRET=session_secret    (not required)
```
### Install packages
```shell
cd backend
npm i

cd frontend
npm i
```
### Start the app

```shell
 backend - npm run dev
 frontend - npm start
```
