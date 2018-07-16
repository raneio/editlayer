### Create .env file and copy the following lines and fill variables

VUE_APP__FIREBASE_PROJECT_ID=
VUE_APP__FIREBASE_API_KEY=

### Create .env.production file and do the same thing with the information of production firebase project

VUE_APP__FIREBASE_PROJECT_ID=
VUE_APP__FIREBASE_API_KEY=

### Enable cors
gsutil cors set rules/cors.rules gs://<PROJECT_ID>.appspot.com
