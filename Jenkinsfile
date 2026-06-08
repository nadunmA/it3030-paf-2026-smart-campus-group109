pipeline {
    agent any

    environment {
        // Backend Config
        BE_IMAGE_NAME = 'smart-campus-backend'
        BE_PORT       = '8081'
        MONGO_URI     = credentials('MONGODB_ATLAS_URI')

        // Frontend Config
        FE_IMAGE_NAME = 'smart-campus-frontend'
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                checkout scm
            }
        }

        // ══════════════════════════════════════════════════════════════════
        // BACKEND STAGES
        // ══════════════════════════════════════════════════════════════════
        stage('2. Build Backend Image') {
            steps {
                script {
                    echo "Building Backend Docker Image..."
                    sh "docker build -f backend/smart-campus/Dockerfile -t ${BE_IMAGE_NAME}:latest backend/smart-campus/"
                }
            }
        }

        stage('3. Deploy Backend Container') {
            steps {
                script {
                    echo "Deploying Backend Container securely..."
                    sh "docker stop ${BE_IMAGE_NAME} || true"
                    sh "docker rm ${BE_IMAGE_NAME} || true"
                    sh "docker run -d --name ${BE_IMAGE_NAME} -p ${BE_PORT}:${BE_PORT} -e SERVER_PORT=${BE_PORT} -e SPRING_DATA_MONGODB_URI='${MONGO_URI}' --restart always ${BE_IMAGE_NAME}:latest"
                }
            }
        }

        // ══════════════════════════════════════════════════════════════════
        // FRONTEND STAGES
        // ══════════════════════════════════════════════════════════════════
        stage('4. Build Frontend Image') {
            steps {
                script {
                    echo "Building Frontend Docker Image..."
                    sh "docker build -f frontend/Dockerfile -t ${FE_IMAGE_NAME}:latest frontend/"
                }
            }
        }

        stage('5. Deploy Frontend Container') {
            steps {
                script {
                    echo "Deploying Frontend Container..."
                    sh "docker stop ${FE_IMAGE_NAME} || true"
                    sh "docker rm ${FE_IMAGE_NAME} || true"
               
                    sh "docker run -d --name ${FE_IMAGE_NAME} -p 80:80 --restart always ${FE_IMAGE_NAME}:latest"
                    echo "Frontend successfully deployed on port 80!"
                }
            }
        }
    }
}