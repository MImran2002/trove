# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# TROVE
## Description

Trove is an idea researched by Dr Stuart Grey and researchers from the University of Bristol. The trove was thought about because looked-after and adopted children after they turned 18 faced identity formation difficulties. When this happened they refer back to the life-story book they received from social workers. When this happened there is a narrative-imbalance in the life-story work because the social worker who created the life-story work fails to allow the child's input. In doing so, it is harder for the child to form their identity with conflicting narratives. 

## Technical Framework

- Front-end: React Native
- Full-stack: Expo ( reliance on device local features )
- Database: SQLite
- Assets: Canva
- IDE: Android Studio

## Folder Structure

```
trove/
├── app/ (where user goes the application page structure)
│   ├── (tabs)/
│   │   ├── _layout.tsx (Tab navigator screen)
│   │   ├── explore.tsx (main scan screen)
│   │   └── index.tsx (main landing screen)
│   │
│   ├── auth/ (Authentication flow)
│   │   ├── login.tsx
│   │   └── signup.tsx
│   │
│   ├── objects/ (Object related pages as in personal objects for trove)
│   │   ├── [id].tsx (Object's detail)
│   │   ├── index.tsx (List of object catalogue)
│   │   └── new.tsx (creating new object)
│   │
│   ├── recording/ (recording flow)
│   │   └── new.tsx (create new recording)
│   │
│   ├── modal.tsx (Global modal screen)
│   ├── index.tsx (Landing Page)
│   └── _layout.tsx (Root navigation system)
│
├── src/ (Core application logic) 
│   ├── db/ (DB set up)
│   │   ├── index.ts (DB connection)
│   │   ├── seed.ts (Initial data seeding)
│   │   └── schema.ts (Table definitons)
│   │
│   ├── repositories/ (Data access layer)
│   │   ├── objectRepository.ts
│   │   ├── objectTypeRepository.ts
│   │   ├── userRepository.ts
│   │   └── recordingRepository.ts
│   │
│   ├── models/ (Data models)
│   │   ├── ObjectType.ts
│   │   ├── PhysicalObject.ts
│   │   ├── Recording.ts
│   │   └── User.ts
│   │
│   ├── utils/ (Helper function)
│   │   └── emojiPassword.ts
│   │
│   └── services/ (Feature logic)
│       └── nfcService.ts
│   
├── assets/
├── package.json
└── README.md
```

## User Flows 

- Authentication (Sign-in): Trove Landing Page --> Trove Sign-in / Sign-up page --> Trove Sign-in Page with Password sequence --> Trove Main Page
- Authentication (Sign-up): Trove Landing Page --> Trove Sign-in / Sign-up page --> Trove Sign-up Page with Password sequence set-up --> Trove Main Page
- Object Registering (taking picture) : Trove Main Page --> Object Scanned Page (if object is not registered) --> Object registration Page --> Camera Page
- Object Registering (voice recording) : Trove Main Page --> Object Scanned Page (if object is not registered) --> Object registration Page --> Voice Recording Page
- Object Registering (taking picture) : Trove Main Page --> Object Scanned Page (if object is not registered) --> Object registration Page --> Camera Page
- Object Look-up : Trove Main Page --> Object Scanned Page (if object is registered) --> Objects catalogue Page --> Video and Voice Replay Model

## Function Flows
### Authentication (Sign-in) Flow:
1). Landing page loads
- Screen: app/(tabs)/index.tsx/HomeScreen()
- Main function: HomeScreen()
- When the button in HomeScreen() is pressed: handleKeyPress()

2). handleKeyPress() decides where to send user

3). Revising: User taps landing page button

- handleKeyPress()
- calls hasRegisteredUser()
- hasRegisteredUser() calls db.getFirstSync(...)
- SQLite checks users table
- result comes back:
- user exists → go to sign in `router.push('/auth/login')`
- no user exists → go to signup

4). Sign-in page flow
Once on the sign-in page, you likely want something like this:
user enters username / identity
user proceeds to password sequence
login submit handler runs
repository checks stored user credentials
if valid, route to main page

So, login.tsx > handleLogin() > deserializeEmojiSequence(user.passwordHash) > sequencesMatch(selectedSequence, storedSequence) > router.replace('/(tabs)/explore');

### Authentication (Sign-up) Flow:
1). Landing page loads
- Screen: app/(tabs)/index.tsx/HomeScreen()
- Main function: HomeScreen()
- When the button in HomeScreen() is pressed: handleKeyPress()

2). handleKeyPress() decides where to send user

3). Revising: User taps landing page button

- handleKeyPress()
- calls hasRegisteredUser()
- hasRegisteredUser() calls db.getFirstSync(...)
- SQLite checks users table
- result comes back:
- user exists → go to sign in 
- no user exists → go to signup `router.push('/auth/signup')`

4). Sign-up page flow
Once on the sign-up page, you likely want something like this:
function: SignupScreen()
user enters username / identity
user proceeds to password sequence (handleEmojiPress())
click submit
repository checks stored user & password credentials (serializeEmojiSequence() and createUser())
if valid, route to main page

So, signup.tsx > SignupScreen() > handleEmojiPress() > serializeEmojiSequence() > createUser() > router.replace('/(tabs)/explore');

### Object Registering (Voice Recording) Flow:
1). Flow:
- app/(tabs)/explore.tsx --> ScanScreen()
- User taps "✚" --> handleScan()
- NFCScanner.scan() → returns tag
- findObjectByNfcTag(tag)

2). Routing
- Exists --> /objects/[id]
- New --> /objects/new?scannedTag=tag

3). New Object Page
- app/objects/new.tsx --> NewObjectScreen()

4). Actions
- handleTakePhoto() → sets imageUri
- handleRecordPress() → sets audioUri

5). Save Flow
- handleSave()
- new PhysicalObject().register() --> createObject()
- If media exists:
   - new Recording().save() --> createRecording()

6).Result
- router.replace('/objects/[id]')

### Object Look-up Flow
1). Steps
- ScanScreen() --> handleScan()
- NFCScanner.scan() --> returns tag 
- FindObjectByNfcTag(tag)

2). Routing
- Exists --> /objects/[id]
- Not found --> /objects/new

3). Object Detail Page
- app/objects/[id].tsx --> ObjectDetailScreen()

### Data Load
- findObjectById(id)
- getRecordingsByObject(id)
- getLatestRecordingByObject(id)

### Object Catalog Flow
1). Steps 
- From Scan screen --> tap 
- router.push('/objects')

2). Screen
- app/objects/index.tsx

3). Data
- getAllObjects() --> load all objects

4). Interaction
- Tap object --> /objects/[id]


### Manual Recording Flow
1). Steps 
- app/recording/new.tsx --> NewRecordingScreen()
- RecordingForm

2). Save
- handleSave()
- new Recording().save() --> createRecording()

3). Result
- router.back()