pipeline {
    agent any

    environment {
        IMAGE_NAME = 'smart-campus-app'
        APP_PORT   = '8080'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker Image from backend directory..."
                  
                    sh "docker build -t ${IMAGE_NAME}:latest backend/smart-campus/"
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    echo "Deploying Container..."
                    
                    sh "docker stop ${IMAGE_NAME} || true"
                    sh "docker rm ${IMAGE_NAME} || true"
                    
                    sh "docker run -d --name ${IMAGE_NAME} -p ${APP_PORT}:${APP_PORT} --restart always ${IMAGE_NAME}:latest"
                    
                    echo "Application successfully deployed on port ${APP_PORT}!"
                }
            }
        }
    }
}