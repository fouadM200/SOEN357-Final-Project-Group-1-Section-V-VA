# SOEN357-Final-Project-Group-1-Section-V-VA

## FitFuel - Overview
FitFuel is a user-centered fitness application designed to bring the most important parts of a healthy routine into one simple and user friendly platform. It combines three key features in one single application: calorie tracking, workout guidance, and online coaching features. By integrating these essential fitness functions into one place, FitFuel application aims to reduce the need for users to switch between multiple applications, thereby lowering interaction effort and making daily fitness habits easier to maintain. The app was designed with a clean and familiar interface to support usability, motivation, and long-term engagement.

## Contributors

| Name                | Student ID |
| ------------------- | ---------- |
| Rami Al Najem       | 40242034   |
| Fouad Meida         | 40249310   |
| Uroosa Lakhani      | 40227274   |
| Trinh Ba Anh        | 40227643   |
| Baila Ly        | 40279603   |

## How to run the app?

## 1. Create the required `.env` files
Before running the project, create all the necessary `.env` files.

Please refer to the final report document and use the environment variable values provided in the "Important links - Github respository" section.

Once done, return to README.md file and continue to follow the remaining steps to run the app.

## 2. Install dependencies
Open a terminal and run:

```bash
cd main
npm install
```
## 3. Run the backend

On the same terminal, run the following command: 
```bash
cd backend
npx tsx server.ts
```

You should see the following message in the terminal

```
Server running on port 5000
```

## 4. Run the frontend

Open a new terminal, then run the following command: 

```bash
cd main
npx expo start
```

## 5. Launch the app

After Expo starts, run the application on an emulator:
- Android emulator
- iOS simulator

Make sure the backend is still running while testing the app.
